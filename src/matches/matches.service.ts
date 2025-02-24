import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Match } from './domain/match';
import { MatchRepository } from './persistence/match.repository';
import { MessageGateway } from '../messages/gateway/message.gateway';
import { InteractionRepository } from '../interactions/infrastructure/persistence/interaction.repository';
import { ErrorResponseDto } from '../utils/dto/error-response.dto';
import { UserProfileDto } from '../user-profile/dto/user-profile.dto';
import { UserProfileService } from '../user-profile/user-profile.service';
import { QueryInteractionDto } from '../interactions/dto/query-interation.dto';
import { InfinityPaginationResponseDto } from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';

@Injectable()
export class MatchService {
  constructor(
    private readonly matchRepository: MatchRepository,
    private readonly messageGateway: MessageGateway,
    private readonly interactionRepository: InteractionRepository,
    private readonly userProfileService: UserProfileService,
  ) {}

  async createMatch(userId: string, matchedUserId: string): Promise<Match> {
    // Kiểm tra nếu match đã tồn tại
    const existingMatch = await this.matchRepository.findByUserIds(
      userId,
      matchedUserId,
    );
    if (existingMatch) {
      throw new Error('Match already exists');
    }

    // Kiểm tra nếu hai người đã LIKE/SUPERLIKE lẫn nhau
    const isMutual = await this.interactionRepository.checkMatch(
      userId,
      matchedUserId,
    );
    if (!isMutual) {
      throw new BadRequestException(
        new ErrorResponseDto(
          400,
          'Users have not mutually liked or superliked each other',
          'No mutual like or superlike detected',
        ),
      );
    }

    // Tạo match mới
    const match = Match.create(userId, matchedUserId);
    const savedMatch = await this.matchRepository.create(match);

    // Gửi thông báo match qua WebSocket
    this.messageGateway.sendMatchNotification(userId, matchedUserId);
    this.messageGateway.sendMatchNotification(matchedUserId, userId);

    return savedMatch;
  }

  // async getUserMatches(userId: string): Promise<UserProfileDto[]> {
  //   const matches = await this.matchRepository.findByUserId(userId);
  //   console.log(matches);
  //   const matchedUserIds = matches.map((match) =>
  //     match.userId === userId ? match.matchedUserId : match.userId,
  //   );
  //   console.log(matchedUserIds);
  //   const userProfiles: UserProfileDto[] = [];
  //   for (const matchedUserId of matchedUserIds) {
  //     const userProfile =
  //       await this.userProfileService.getUserWithProfile(matchedUserId);
  //     if (userProfile) {
  //       userProfiles.push(userProfile);
  //     }
  //   }
  //   console.log(userProfiles);
  //   return userProfiles;
  // }
  async getUserMatches(
    userId: string,
    query: QueryInteractionDto,
  ): Promise<InfinityPaginationResponseDto<UserProfileDto>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    // Gọi hàm mới trong repository
    const [matches, totalItems] =
      await this.matchRepository.findAndCountByUserId(userId, page, limit);

    console.log('Matches:', matches);

    const matchedUserIds = matches.map((match) =>
      match.userId === userId ? match.matchedUserId : match.userId,
    );

    console.log('Matched User IDs:', matchedUserIds);

    const userProfiles = await Promise.all(
      matchedUserIds.map(async (matchedUserId) => {
        console.log(`Fetching profile for user: ${matchedUserId}`);
        return await this.userProfileService.getUserWithProfile(matchedUserId);
      }),
    );

    return infinityPagination(
      userProfiles.filter((profile) => profile !== null) as UserProfileDto[],
      totalItems,
      { page, limit },
    );
  }

  async deleteMatch(userId: string, matchedUserId: string): Promise<void> {
    const match = await this.matchRepository.findByUserIds(
      userId,
      matchedUserId,
    );
    if (!match) {
      throw new NotFoundException('Match not found');
    }
    await this.matchRepository.remove(match.id);
  }
}
