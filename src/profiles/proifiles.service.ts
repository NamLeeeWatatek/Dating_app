import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
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
import { PaginationResult } from '../utils/dto/pagination-result.dto';
import { FilesFirebaseService } from '../files/infrastructure/uploader/firebase/files.service';
import { FilesService } from '../files/files.service';

@Injectable()
export class ProfileService {
  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly usersService: UsersService,
    private readonly firebaseStorageService: FilesFirebaseService,
    private readonly filesService: FilesService,
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
    const existingProfile = await this.profileRepository.findByUserId(
      createProfileDto.userId,
    );
    if (existingProfile) {
      throw new ConflictException({
        status: HttpStatus.CONFLICT,
        errors: {
          userId: 'profileAlreadyExists',
        },
      });
    }
    return this.profileRepository.create({
      user,
      displayName: createProfileDto.displayName,
      age: createProfileDto.age,
      gender: createProfileDto.gender,
      bio: createProfileDto.bio,
      sexualOrientation: createProfileDto.sexualOrientation,
      isPublic: createProfileDto.isPublic,
      location: createProfileDto.location,
      latitude: createProfileDto.latitude,
      longitude: createProfileDto.longitude,
    });
  }
  async findByUserId(userId: string): Promise<NullableType<Profile>> {
    return this.profileRepository.findByUserId(userId);
  }
  async uploadProfilePhotos(
    userId: string,
    files: Express.Multer.File[],
  ): Promise<string[]> {
    const profile = await this.profileRepository.findByUserId(userId);
    if (!profile) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: { userId: 'profileNotFound' },
      });
    }

    // 1. Upload và lưu file vào database
    const savedFiles = await this.firebaseStorageService.createMultiple(
      files,
      'uploads/profiles',
    );

    // 2. Lấy danh sách ID của các file đã lưu
    const fileIds = savedFiles.files.map((file) => file.id);

    // 3. Cập nhật profile với danh sách ID file thay vì URL
    profile.files = [...(profile.files || []), ...fileIds];
    await this.profileRepository.update(profile.id, { files: profile.files });

    return fileIds;
  }
  async getProfilePhotos(fileIds: string[]): Promise<{ images: string[] }> {
    if (!fileIds || fileIds.length === 0) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: { fileIds: 'fileIdsRequired' },
      });
    }

    // Lấy danh sách file từ service
    const files = await this.filesService.findByIds(fileIds);

    // Trích xuất danh sách `path` từ files
    const imagePaths = files.map((file) => file.path);

    return { images: imagePaths };
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterProfileDto | null;
    sortOptions?: SortProfileDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<PaginationResult<Profile>> {
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
      sexualOrientation: updateProfileDto.sexualOrientation,
      isPublic: updateProfileDto.isPublic,
      location: updateProfileDto.location,
      longitude: updateProfileDto.longitude,
      latitude: updateProfileDto.latitude,
    });
  }
  async remove(id: Profile['id']): Promise<void> {
    await this.profileRepository.remove(id);
  }
}
