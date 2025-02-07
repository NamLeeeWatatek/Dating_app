import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ProfileRepository } from './infrastructure/persistence/profile.repository';
import { UsersService } from '../users/users.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { Profile } from './domain/profile';
import { FilterProfileDto, SortProfileDto } from './dto/query-profile.dto';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { NullableType } from '../utils/types/nullable.type';

@Injectable()
export class ProfileService {
  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly usersService: UsersService,
  ) {}

  async create(createProfileDto: CreateProfileDto): Promise<Profile> {
    // Kiểm tra xem user có tồn tại không
    const user = await this.usersService.findById(createProfileDto.userId);
    if (!user) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          userId: 'userNotFound',
        },
      });
    }

    return this.profileRepository.create({
      user,
      displayName: createProfileDto.displayName,
      age: createProfileDto.age,
      gender: createProfileDto.gender,
      bio: createProfileDto.bio,
      interests: createProfileDto.interests,
      avatarUrl: createProfileDto.avatarUrl,
    });
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterProfileDto | null;
    sortOptions?: SortProfileDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Profile[]> {
    return this.profileRepository.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }

  async findById(id: Profile['id']): Promise<NullableType<Profile>> {
    return this.profileRepository.findById(id);
  }

  async update(
    id: Profile['id'],
    updateProfileDto: UpdateProfileDto,
  ): Promise<Profile | null> {
    // Kiểm tra xem profile có tồn tại không
    const existingProfile = await this.profileRepository.findById(id);
    if (!existingProfile) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          id: 'profileNotFound',
        },
      });
    }

    return this.profileRepository.update(id, {
      displayName: updateProfileDto.displayName,
      age: updateProfileDto.age,
      gender: updateProfileDto.gender,
      bio: updateProfileDto.bio,
      interests: updateProfileDto.interests,
      avatarUrl: updateProfileDto.avatarUrl,
    });
  }

  async remove(id: Profile['id']): Promise<void> {
    await this.profileRepository.remove(id);
  }
}
