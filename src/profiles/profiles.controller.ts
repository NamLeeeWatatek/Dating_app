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
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
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

@ApiBearerAuth()
@Roles(RoleEnum.user)
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
  })
  @SerializeOptions({
    groups: ['user'],
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProfileDto: CreateProfileDto): Promise<Profile> {
    return this.profileService.create(createProfileDto);
  }

  @ApiOkResponse({
    type: InfinityPaginationResponse(Profile),
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

    return infinityPagination(
      await this.profileService.findManyWithPagination({
        filterOptions: query?.filters,
        sortOptions: query?.sort,
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
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
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
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
