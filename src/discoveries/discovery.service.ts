import { Injectable } from '@nestjs/common';
import { Between, In, Raw, Repository } from 'typeorm';
import { Profile } from '../profiles/domain/profile';
import { FilterDiscoveryDto } from './dto/query-discovery.dto';
import { ProfileMapper } from '../profiles/infrastructure/persistence/relational/mappers/profile.mapper';
import { PaginationResult } from '../utils/dto/pagination-result.dto';
import { ProfileEntity } from '../profiles/infrastructure/persistence/relational/entities/profile.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { InteractionType } from '../interactions/enums/interaction.enum';
import { UserPreferenceEntity } from '../user-preferences/infrastructure/persistence/relational/entities/user-preference.entity';
import { InteractionEntity } from '../interactions/infrastructure/persistence/relational/entities/interaction.entity';

@Injectable()
export class DiscoveryService {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profilesRepository: Repository<ProfileEntity>,
    @InjectRepository(UserPreferenceEntity)
    private readonly userReferenceRepository: Repository<UserPreferenceEntity>,
    @InjectRepository(InteractionEntity) // Inject InteractionRepository
    private readonly interactionRepository: Repository<InteractionEntity>,
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
  }): Promise<PaginationResult<Profile>> {
    const where: any = {};
    const userProfile = await this.profilesRepository.findOne({
      where: { user: { id: userId } },
    });

    const [userLat, userLng] = [userProfile?.latitude, userProfile?.longitude];

    if (userProfile?.sexualOrientation?.length) {
      where.gender = In(userProfile.sexualOrientation);
    }

    if (filterOptions?.ageRange) {
      where.age = Between(filterOptions.ageRange[0], filterOptions.ageRange[1]);
    }

    if (filterOptions?.distanceRange && userLat && userLng) {
      where.latitude = Raw(
        () =>
          `(6371 * acos(cos(radians(${userLat})) * cos(radians(ProfileEntity.latitude)) *
            cos(radians(ProfileEntity.longitude) - radians(${userLng})) +
            sin(radians(${userLat})) * sin(radians(ProfileEntity.latitude)))) <= ${filterOptions.distanceRange}`,
      );
    }

    // Lấy tất cả người dùng trong phạm vi tìm kiếm
    const [entities] = await this.profilesRepository.findAndCount({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: where,
    });

    // Bước 1: Lấy sở thích của người đang tìm kiếm
    const userPreferences = await this.userReferenceRepository.find({
      where: { user: { id: userId } },
    });

    const likedUsers: string[] = [];
    const superlikedUsers: string[] = [];
    const dislikedUsers: string[] = []; // Mảng để lưu người dùng đã dislike
    const matchedUsers: ProfileEntity[] = [];
    for (const entity of entities) {
      const otherUserPreferences = await this.userReferenceRepository.find({
        where: { user: { id: entity.user.id } },
      });

      // Nếu người tìm kiếm chưa có sở thích, không xét điều kiện sở thích
      if (userPreferences.length > 0) {
        const hasCommonPreferences = userPreferences.some((userPref) =>
          otherUserPreferences.some(
            (otherUserPref) =>
              userPref.hobbies.some((hobby) =>
                otherUserPref.hobbies.includes(hobby),
              ) ||
              userPref.communicationStyles.some((style) =>
                otherUserPref.communicationStyles.includes(style),
              ) ||
              userPref.diet.some((diet) => otherUserPref.diet.includes(diet)) ||
              userPref.drinking.some((drinking) =>
                otherUserPref.drinking.includes(drinking),
              ) ||
              userPref.education.some((education) =>
                otherUserPref.education.includes(education),
              ) ||
              userPref.exercise.some((exercise) =>
                otherUserPref.exercise.includes(exercise),
              ) ||
              userPref.zodiacSigns.some((zodiacSigns) =>
                otherUserPref.zodiacSigns.includes(zodiacSigns),
              ) ||
              userPref.futureFamily.some((futureFamily) =>
                otherUserPref.futureFamily.includes(futureFamily),
              ) ||
              userPref.languages.some((languages) =>
                otherUserPref.languages.includes(languages),
              ) ||
              userPref.lookingFor.some((lookingFor) =>
                otherUserPref.lookingFor.includes(lookingFor),
              ) ||
              userPref.personalityTypes.some((personalityTypes) =>
                otherUserPref.personalityTypes.includes(personalityTypes),
              ) ||
              userPref.petPreferences.some((petPreferences) =>
                otherUserPref.petPreferences.includes(petPreferences),
              ),
          ),
        );

        // Nếu có ít nhất một sở thích chung, thêm người này vào danh sách
        if (hasCommonPreferences) {
          matchedUsers.push(entity);
        }
      } else {
        // Nếu người tìm kiếm không có sở thích, thêm tất cả vào matchedUsers
        matchedUsers.push(entity);
      }

      // Xử lý interactions (like, superlike, dislike) từ cơ sở dữ liệu
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
          dislikedUsers.push(entity.user.id); // Thêm vào danh sách người dùng đã dislike
        }
      });
    }

    // Lọc các người đã tương tác với người truy vấn (LIKE, SUPERLIKE, DISLIKE)
    const filteredMatchedUsers = matchedUsers.filter(
      (entity) =>
        !dislikedUsers.includes(entity.user.id) && // Loại bỏ người đã DISLIKE
        !likedUsers.includes(entity.user.id) && // Loại bỏ người đã LIKE
        !superlikedUsers.includes(entity.user.id), // Loại bỏ người đã SUPERLIKE
    );

    // Sắp xếp danh sách theo mức độ ưu tiên (liked, superliked)
    const preferredUsers = [...likedUsers, ...superlikedUsers];

    const orderedEntities = filteredMatchedUsers.sort((a, b) => {
      const priorityA = preferredUsers.includes(a.user.id) ? 1 : 0;
      const priorityB = preferredUsers.includes(b.user.id) ? 1 : 0;
      return priorityB - priorityA; // Sắp xếp theo ưu tiên (1 sẽ đứng trước 0)
    });

    // Trộn danh sách người dùng theo kiểu random
    const shuffledEntities = this.shuffleArray(orderedEntities);

    // Trả về kết quả đã sắp xếp, loại bỏ người dùng đang tìm kiếm
    const result = shuffledEntities
      .filter((item) => item.user.id !== userId) // Loại bỏ người dùng đang tìm kiếm
      .map((item) => ProfileMapper.toDomain(item));

    // Cập nhật lại tổng số sau khi lọc kết quả
    const filteredTotalItems = shuffledEntities.filter(
      (item) => item.user.id !== userId, // Loại bỏ người tìm kiếm
    ).length;

    return {
      data: result,
      totalItems: filteredTotalItems, // Trả về tổng số sau khi lọc
    };
  }
}
