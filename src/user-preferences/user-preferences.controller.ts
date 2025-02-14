import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { UserPreferencesService } from './user-preferences.service';
import { CreateUserPreferenceDto } from './dto/create-user-preference.dto';
import { UserPreference } from './domain/user-preference';
import { NullableType } from '../utils/types/nullable.type';
import { UpdateUserPreferenceDto } from './dto/update-user-preference.dto';
import { User } from '../users/domain/user';
import { RoleEnum } from '../roles/roles.enum';

@ApiBearerAuth()
@Roles(RoleEnum.admin, RoleEnum.user)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('User Preferences')
@Controller({
  path: 'users/preferences',
  version: '1',
})
export class UserPreferencesController {
  constructor(
    private readonly userPreferencesService: UserPreferencesService,
  ) {}

  @ApiCreatedResponse({
    type: UserPreference,
  })
  @SerializeOptions({
    groups: ['admin'],
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createUserPreferenceDto: CreateUserPreferenceDto,
  ): Promise<UserPreference> {
    return this.userPreferencesService.create(createUserPreferenceDto);
  }

  @ApiOkResponse({
    type: UserPreference,
  })
  @SerializeOptions({
    groups: ['admin'],
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  findOne(
    @Param('id') id: UserPreference['id'],
  ): Promise<NullableType<UserPreference>> {
    return this.userPreferencesService.findById(id);
  }

  @ApiOkResponse({
    type: UserPreference,
  })
  @SerializeOptions({
    groups: ['admin'],
  })
  @Get('user/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'userId',
    type: String,
    required: true,
  })
  findOneByUserId(
    @Param('userId') userId: User['id'],
  ): Promise<NullableType<UserPreference>> {
    return this.userPreferencesService.findByUserId(userId);
  }

  @ApiOkResponse({
    type: UserPreference,
  })
  @SerializeOptions({
    groups: ['admin'],
  })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  update(
    @Param('id') id: UserPreference['id'],
    @Body() updateUserPreferenceDto: UpdateUserPreferenceDto,
  ): Promise<UserPreference | null> {
    return this.userPreferencesService.update(id, updateUserPreferenceDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: UserPreference['id']): Promise<void> {
    return this.userPreferencesService.remove(id);
  }
}
