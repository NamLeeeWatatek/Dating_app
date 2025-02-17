import { Injectable } from '@nestjs/common';
import { Between, In, Like, Repository } from 'typeorm';
import { Profile } from '../profiles/domain/profile';
import {
  FilterDiscoveryDto,
  SortDiscoveryDto,
} from './dto/query-discovery.dto';
import { ProfileMapper } from '../profiles/infrastructure/persistence/relational/mappers/profile.mapper';
import { PaginationResult } from '../utils/dto/pagination-result.dto';
import { ProfileEntity } from '../profiles/infrastructure/persistence/relational/entities/profile.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DiscoveryService {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profilesRepository: Repository<ProfileEntity>,
  ) {}

  // Hàm tính khoảng cách giữa 2 điểm dựa trên vĩ độ và kinh độ
  private calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
  ): number {
    const R = 6371; // Radius of Earth in kilometers
    const dLat = this.degreesToRadians(lat2 - lat1);
    const dLng = this.degreesToRadians(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.degreesToRadians(lat1)) *
        Math.cos(this.degreesToRadians(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
  }

  private degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

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

    if (filterOptions?.location) {
      where.location = Like(`%${filterOptions.location}%`);
    }
    console.log('distance:', filterOptions?.distanceRange);
    if (filterOptions?.distanceRange) {
      const distanceRange = filterOptions.distanceRange;
      const usersWithinDistance: ProfileEntity[] = [];

      const users = await this.profilesRepository.find(); // Hoặc tìm theo các tiêu chí khác

      users.forEach((user) => {
        const distance = this.calculateDistance(
          userLat!,
          userLng!,
          user.latitude!,
          user.longitude!,
        );
        if (distance <= distanceRange) {
          usersWithinDistance.push(user);
        }
      });

      // Cập nhật danh sách người dùng trong phạm vi khoảng cách
      where.id = In(usersWithinDistance.map((user) => user.id));
    }

    // Tính toán và phân trang dữ liệu
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

    return {
      data: entities.map((user) => ProfileMapper.toDomain(user)),
      totalItems,
    };
  }
}
