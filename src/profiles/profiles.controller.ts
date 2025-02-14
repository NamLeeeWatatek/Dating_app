import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpStatus,
  HttpCode,
  SerializeOptions,
  UnprocessableEntityException,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { RolesGuard } from '../roles/roles.guard';

import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';

import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { QueryProfileDto } from './dto/query-profile.dto';
import { Profile } from './domain/profile';
import { NullableType } from '../utils/types/nullable.type';
import { ProfileService } from './proifiles.service';
import { ErrorResponseDto } from '../utils/dto/error-response.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { GetProfilePhotosDto } from './dto/get-photos-profile.dto';

@ApiBearerAuth()
@Roles(RoleEnum.user, RoleEnum.admin)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Profiles')
@Controller({
  path: 'profiles',
  version: '1',
})
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @ApiCreatedResponse({
    type: Profile,
    description: 'Returns newly created profile information.',
  })
  @ApiOperation({
    summary: 'Create new profile',
    description:
      'This API allows creating a new user profile by sending information in the request body.',
  })
  @SerializeOptions({
    groups: ['user'],
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProfileDto: CreateProfileDto): Promise<Profile> {
    return this.profileService.create(createProfileDto);
  }

  @Post('photos')
  @ApiOperation({ summary: 'Get list image by fileIds' })
  async getProfilePhotos(@Body() dto: GetProfilePhotosDto) {
    return this.profileService.getProfilePhotos(dto.fileIds);
  }

  @ApiOkResponse({
    type: InfinityPaginationResponse(Profile),
  })
  @ApiOperation({
    summary: 'Get list of profiles',
    description: 'This API supports paging and filtering of profile data.',
  })
  @SerializeOptions({
    groups: ['user'],
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query: QueryProfileDto,
  ): Promise<InfinityPaginationResponseDto<Profile>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    const { data, totalItems } =
      await this.profileService.findManyWithPagination({
        filterOptions: query?.filters,
        sortOptions: query?.sort,
        paginationOptions: {
          page,
          limit,
        },
      });

    return infinityPagination(data, totalItems, { page, limit });
  }

  @ApiOkResponse({
    type: Profile,
  })
  @SerializeOptions({
    groups: ['user'],
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  findOne(@Param('id') id: Profile['id']): Promise<NullableType<Profile>> {
    return this.profileService.findById(id);
  }
  @ApiOkResponse({
    type: Profile,
  })
  @SerializeOptions({
    groups: ['user'],
  })
  @Get('user/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'userId',
    type: String,
    required: true,
  })
  async findByUserId(@Param('userId') userId: string): Promise<Profile> {
    const profile = await this.profileService.findByUserId(userId);
    if (!profile) {
      throw new UnprocessableEntityException(
        new ErrorResponseDto(
          HttpStatus.UNPROCESSABLE_ENTITY,
          'Profile not found',
          'profileNotFound',
        ),
      );
    }
    return profile;
  }
  @ApiOperation({
    summary: 'Upload multiple profile photos',
    description:
      'Uploads multiple photos and associates them with a user profile.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({
    description: 'Returns uploaded image URLs.',
    type: [String],
  })
  @ApiParam({ name: 'userId', type: String, required: true })
  @ApiBody({
    description: 'Upload profile files',
    schema: {
      type: 'object',
      properties: {
        photos: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
    },
  })
  @Post(':userId/upload-photos')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'photos', maxCount: 5 }]))
  async uploadProfilePhotos(
    @Param('userId') userId: string,
    @UploadedFiles() files: { photos?: Express.Multer.File[] },
  ): Promise<string[]> {
    if (!files?.photos || files.photos.length === 0) {
      throw new UnprocessableEntityException(
        new ErrorResponseDto(
          HttpStatus.UNPROCESSABLE_ENTITY,
          'No photos uploaded',
          'noPhotosProvided',
        ),
      );
    }

    return this.profileService.uploadProfilePhotos(userId, files.photos);
  }
  @ApiOkResponse({
    type: Profile,
  })
  @SerializeOptions({
    groups: ['user'],
  })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiBody({ type: UpdateProfileDto }) // Thêm dòng này
  update(
    @Param('id') id: Profile['id'],
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<Profile | null> {
    return this.profileService.update(id, updateProfileDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: Profile['id']): Promise<void> {
    return this.profileService.remove(id);
  }
}
