import { Injectable } from '@nestjs/common';
import { Between, Raw, Repository } from 'typeorm';
import { Profile } from '../profiles/domain/profile';
import {
  FilterDiscoveryDto,
  SortDiscoveryDto,
} from './dto/query-discovery.dto';
import { ProfileMapper } from '../profiles/infrastructure/persistence/relational/mappers/profile.mapper';
import { PaginationResult } from '../utils/dto/pagination-result.dto';
import { ProfileEntity } from '../profiles/infrastructure/persistence/relational/entities/profile.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { InteractionType } from '../interactions/enums/interaction.enum';
import { RedisService } from '../redis/redis.service';
import { UserPreferenceEntity } from '../user-preferences/infrastructure/persistence/relational/entities/user-preference.entity';

@Injectable()
export class DiscoveryService {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profilesRepository: Repository<ProfileEntity>,
    private readonly redisService: RedisService,
    @InjectRepository(UserPreferenceEntity)
    private readonly userReferenceRepository: Repository<UserPreferenceEntity>,
  ) {}
  private readonly interactionFolder = 'interactions';

  async findMatchingUsers({
    userId,
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    userId: string;
    filterOptions?: FilterDiscoveryDto;
    sortOptions?: SortDiscoveryDto[] | null;
    paginationOptions: { page: number; limit: number };
  }): Promise<PaginationResult<Profile>> {
    const where: any = {};
    const userProfile = await this.profilesRepository.findOne({
      where: { user: { id: userId } },
    });

    const [userLat, userLng] = [userProfile?.latitude, userProfile?.longitude];

    if (filterOptions?.gender) {
      where.gender = filterOptions.gender;
    }

    if (filterOptions?.ageRange) {
      where.age = Between(filterOptions.ageRange[0], filterOptions.ageRange[1]);
    }

    if (filterOptions?.distanceRange && userLat && userLng) {
      where.latitude = Raw(
        (alias) =>
          `(6371 * acos(cos(radians(${userLat})) * cos(radians(${alias})) * 
          cos(radians(${alias}) - radians(${userLng})) + 
          sin(radians(${userLat})) * sin(radians(${alias})))) <= ${filterOptions.distanceRange}`,
      );
    }

    // Lấy tất cả người dùng trong phạm vi tìm kiếm
    const [entities, totalItems] = await this.profilesRepository.findAndCount({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: where,
      order: sortOptions?.reduce(
        (accumulator, sort) => ({
          ...accumulator,
          [sort.orderBy]: sort.order,
        }),
        {},
      ),
    });

    // Bước 1: Lấy thông tin ưu tiên từ Redis (hoặc DB) về các người đã "like" hoặc "superlike"
    const likedUsers: string[] = [];
    const superlikedUsers: string[] = [];

    for (const entity of entities) {
      const redisKey = `interactions:${userId}:${entity.user.id}`;
      const interactionType = await this.redisService.get(
        this.interactionFolder,
        redisKey,
      );

      if (interactionType === InteractionType.LIKE) {
        likedUsers.push(entity.user.id); // Người này đã "like"
      } else if (interactionType === InteractionType.SUPERLIKE) {
        superlikedUsers.push(entity.user.id); // Người này đã "superlike"
      }
    }

    // Bước 2: Sắp xếp lại danh sách người dùng dựa trên ưu tiên
    const preferredUsers = [...likedUsers, ...superlikedUsers];

    // Sắp xếp các entities theo mức độ ưu tiên
    const orderedEntities = entities.sort((a, b) => {
      const priorityA = preferredUsers.includes(a.user.id) ? 1 : 0;
      const priorityB = preferredUsers.includes(b.user.id) ? 1 : 0;
      return priorityB - priorityA; // Sắp xếp theo ưu tiên (1 sẽ đứng trước 0)
    });

    // Trả về kết quả đã sắp xếp
    return {
      data: orderedEntities.map((item) => ProfileMapper.toDomain(item)),
      totalItems,
    };
  }
}
