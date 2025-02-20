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

@Injectable()
export class MatchService {
  constructor(
    private readonly matchRepository: MatchRepository,
    private readonly messageGateway: MessageGateway,
    private readonly interactionRepository: InteractionRepository,
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

  async getUserMatches(userId: string): Promise<Match[]> {
    return await this.matchRepository.findByUserId(userId);
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
