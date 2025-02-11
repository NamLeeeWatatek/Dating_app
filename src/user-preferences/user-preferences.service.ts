import { Injectable } from '@nestjs/common';
import { CreateUserPreferenceDto } from './dto/create-user-preference.dto';
import { NullableType } from '../utils/types/nullable.type';

import { UserPreference } from './domain/user-preference';
import { UpdateUserPreferenceDto } from './dto/update-user-preference.dto';
import { UserPreferenceRepository } from './infrastructure/persistence/user-preference.repository';
import { User } from '../users/domain/user';

@Injectable()
export class UserPreferencesService {
  constructor(
    private readonly userPreferenceRepository: UserPreferenceRepository,
  ) {}

  async create(
    createUserDto: CreateUserPreferenceDto,
  ): Promise<UserPreference> {
    const userPreference = new UserPreference();
    userPreference.userId = createUserDto.userId;
    userPreference.hobbies = createUserDto.hobbies ?? [];
    userPreference.lookingFor = createUserDto.lookingFor ?? [];
    userPreference.languages = createUserDto.languages ?? [];
    userPreference.zodiacSigns = createUserDto.zodiacSigns ?? [];
    userPreference.education = createUserDto.education ?? [];
    userPreference.futureFamily = createUserDto.futureFamily ?? [];
    userPreference.personalityTypes = createUserDto.personalityTypes ?? [];
    userPreference.communicationStyles =
      createUserDto.communicationStyles ?? [];
    userPreference.petPreferences = createUserDto.petPreferences ?? [];
    userPreference.drinking = createUserDto.drinking ?? [];
    userPreference.smoking = createUserDto.smoking ?? [];
    userPreference.exercise = createUserDto.exercise ?? [];
    userPreference.diet = createUserDto.diet ?? [];
    userPreference.socialMedia = createUserDto.socialMedia ?? [];
    userPreference.sleepHabits = createUserDto.sleepHabits ?? [];

    return this.userPreferenceRepository.create(userPreference);
  }

  findById(id: UserPreference['id']): Promise<NullableType<UserPreference>> {
    return this.userPreferenceRepository.findById(id);
  }

  findByUserId(userId: User['id']): Promise<NullableType<UserPreference>> {
    return this.userPreferenceRepository.findByUserId(userId);
  }

  async update(
    id: UserPreference['id'],
    updateUserPreferenceDto: UpdateUserPreferenceDto,
  ): Promise<UserPreference | null> {
    const existingUserPreference =
      await this.userPreferenceRepository.findById(id);

    if (!existingUserPreference) {
      throw new Error('User Preferences not found');
    }

    const updatedUserPreference = await this.userPreferenceRepository.update(
      id,
      updateUserPreferenceDto,
    );

    return updatedUserPreference;
  }

  async remove(id: UserPreference['id']): Promise<void> {
    await this.userPreferenceRepository.remove(id);
  }
}
