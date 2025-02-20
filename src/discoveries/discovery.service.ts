import { Injectable, NotFoundException } from '@nestjs/common';
import { Between, In, Repository } from 'typeorm';
import { FilterDiscoveryDto } from './dto/query-discovery.dto';
import { ProfileMapper } from '../profiles/infrastructure/persistence/relational/mappers/profile.mapper';
import { PaginationResult } from '../utils/dto/pagination-result.dto';
import { ProfileEntity } from '../profiles/infrastructure/persistence/relational/entities/profile.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { InteractionType } from '../interactions/enums/interaction.enum';
import { UserPreferenceEntity } from '../user-preferences/infrastructure/persistence/relational/entities/user-preference.entity';
import { InteractionEntity } from '../interactions/infrastructure/persistence/relational/entities/interaction.entity';
import { UserPreferencesService } from '../user-preferences/user-preferences.service';
import { ProfileService } from '../profiles/proifiles.service';

@Injectable()
export class DiscoveryService {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profilesRepository: Repository<ProfileEntity>,
    @InjectRepository(UserPreferenceEntity)
    private readonly userReferenceRepository: Repository<UserPreferenceEntity>,
    @InjectRepository(InteractionEntity)
    private readonly interactionRepository: Repository<InteractionEntity>,
    private readonly profileService: ProfileService,
    private readonly userPreferencesService: UserPreferencesService,
  ) {}

  // Thuật toán Fisher-Yates Shuffle
  private shuffleArray(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
  }

  async findMatchingUsers({
    userId,
    filterOptions,
    paginationOptions,
  }: {
    userId: string;
    filterOptions?: FilterDiscoveryDto;
    paginationOptions: { page: number; limit: number };
  }): Promise<PaginationResult<any>> {
    const where: any = {};
    const userProfile = await this.profilesRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!userProfile) {
      throw new NotFoundException(
        `Không tìm thấy profile của userId: ${userId}`,
      );
    }

    if (userProfile.sexualOrientation?.length) {
      where.gender = In(userProfile.sexualOrientation);
    }

    if (filterOptions?.ageRange) {
      where.age = Between(filterOptions.ageRange[0], filterOptions.ageRange[1]);
    }

    const [entities] = await this.profilesRepository.findAndCount({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where,
      relations: ['user'],
    });

    const userPreferences = await this.userReferenceRepository.find({
      where: { user: { id: userId } },
    });

    const likedUsers: string[] = [];
    const superlikedUsers: string[] = [];
    const dislikedUsers: string[] = [];
    const matchedUsers: ProfileEntity[] = [];

    for (const entity of entities) {
      const otherUserPreferences = await this.userReferenceRepository.find({
        where: { user: { id: entity.user.id } },
      });

      if (!otherUserPreferences) {
        throw new NotFoundException(
          `Không tìm thấy profile của userId: ${entity.user.id}`,
        );
      }

      if (userPreferences.length > 0) {
        const hasCommonPreferences = userPreferences.some((userPref) =>
          otherUserPreferences.some(
            (otherUserPref) =>
              userPref.hobbies.some((hobby) =>
                otherUserPref.hobbies.includes(hobby),
              ) ||
              userPref.languages.some((languages) =>
                otherUserPref.languages.includes(languages),
              ),
          ),
        );

        if (hasCommonPreferences) {
          matchedUsers.push(entity);
        }
      } else {
        matchedUsers.push(entity);
      }

      const interactions = await this.interactionRepository.find({
        where: [
          { senderUserId: userId, receiverUserId: entity.user.id },
          { senderUserId: entity.user.id, receiverUserId: userId },
        ],
      });

      interactions.forEach((interaction) => {
        if (interaction.type === InteractionType.LIKE) {
          likedUsers.push(entity.user.id);
        } else if (interaction.type === InteractionType.SUPERLIKE) {
          superlikedUsers.push(entity.user.id);
        } else if (interaction.type === InteractionType.DISLIKE) {
          dislikedUsers.push(entity.user.id);
        }
      });
    }

    const filteredMatchedUsers = matchedUsers.filter(
      (entity) =>
        !dislikedUsers.includes(entity.user.id) &&
        !likedUsers.includes(entity.user.id) &&
        !superlikedUsers.includes(entity.user.id),
    );

    const preferredUsers = [...likedUsers, ...superlikedUsers];

    const orderedEntities = filteredMatchedUsers.sort((a, b) => {
      const priorityA = preferredUsers.includes(a.user.id) ? 1 : 0;
      const priorityB = preferredUsers.includes(b.user.id) ? 1 : 0;
      return priorityB - priorityA;
    });

    const shuffledEntities = this.shuffleArray(orderedEntities);

    const result = await Promise.all(
      shuffledEntities.map(async (profile: ProfileEntity) => {
        const fileIds = Array.isArray(profile.files) ? profile.files : [];
        const [files, userPreferencesData] = await Promise.all([
          fileIds.length > 0
            ? this.profileService.getProfilePhotos(fileIds)
            : { images: [] },
          this.userPreferencesService.findByUserId(profile.user.id),
        ]);

        return {
          ...ProfileMapper.toDomain(profile),
          files,
          userPreferencesData,
        };
      }),
    );

    return {
      data: result,
      totalItems: result.length,
    };
  }
}
