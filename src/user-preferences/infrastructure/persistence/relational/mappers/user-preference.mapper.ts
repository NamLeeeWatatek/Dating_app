import {
  Hobby,
  LookingFor,
  Language,
  ZodiacSign,
  Education,
  FutureFamily,
  PersonalityType,
  CommunicationStyle,
  PetPreference,
  Drinking,
  Smoking,
  Exercise,
  Diet,
  SocialMedia,
  SleepHabit,
} from '../../../../../utils/enums/preferences.enum';
import { UserPreference } from '../../../../domain/user-preference';
import {
  UserEntity,
  UserPreferenceEntity,
} from '../entities/user-preference.entity';

export class UserPreferenceMapper {
  static toDomain(raw: UserPreferenceEntity): UserPreference {
    const domainEntity = new UserPreference();
    domainEntity.id = raw.id;
    domainEntity.userId = raw.user.id;
    domainEntity.hobbies = raw.hobbies ?? [];
    domainEntity.lookingFor = raw.lookingFor ?? [];
    domainEntity.languages = raw.languages ?? [];
    domainEntity.zodiacSigns = raw.zodiacSigns ?? [];
    domainEntity.education = raw.education ?? [];
    domainEntity.futureFamily = raw.futureFamily ?? [];
    domainEntity.personalityTypes = raw.personalityTypes ?? [];
    domainEntity.communicationStyles = raw.communicationStyles ?? [];
    domainEntity.petPreferences = raw.petPreferences ?? [];
    domainEntity.drinking = raw.drinking ?? [];
    domainEntity.smoking = raw.smoking ?? [];
    domainEntity.exercise = raw.exercise ?? [];
    domainEntity.diet = raw.diet ?? [];
    domainEntity.socialMedia = raw.socialMedia ?? [];
    domainEntity.sleepHabits = raw.sleepHabits ?? [];

    return domainEntity;
  }

  static toPersistence(domain: UserPreference): UserPreferenceEntity {
    const persistenceEntity = new UserPreferenceEntity();
    persistenceEntity.id = domain.id;
    persistenceEntity.user = new UserEntity();
    persistenceEntity.user.id = domain.userId;
    persistenceEntity.hobbies =
      domain.hobbies.map((hobby) => hobby as Hobby) ?? [];
    persistenceEntity.lookingFor =
      domain.lookingFor.map((item) => item as LookingFor) ?? [];
    persistenceEntity.languages =
      domain.languages.map((lang) => lang as Language) ?? [];
    persistenceEntity.zodiacSigns =
      domain.zodiacSigns.map((zodiac) => zodiac as ZodiacSign) ?? [];
    persistenceEntity.education =
      domain.education.map((edu) => edu as Education) ?? [];
    persistenceEntity.futureFamily =
      domain.futureFamily.map((family) => family as FutureFamily) ?? [];
    persistenceEntity.personalityTypes =
      domain.personalityTypes.map((type) => type as PersonalityType) ?? [];
    persistenceEntity.communicationStyles =
      domain.communicationStyles.map((style) => style as CommunicationStyle) ??
      [];
    persistenceEntity.petPreferences =
      domain.petPreferences.map((pet) => pet as PetPreference) ?? [];
    persistenceEntity.drinking =
      domain.drinking.map((drink) => drink as Drinking) ?? [];
    persistenceEntity.smoking =
      domain.smoking.map((smoke) => smoke as Smoking) ?? [];
    persistenceEntity.exercise =
      domain.exercise.map((ex) => ex as Exercise) ?? [];
    persistenceEntity.diet = domain.diet.map((diet) => diet as Diet) ?? [];
    persistenceEntity.socialMedia =
      domain.socialMedia.map((media) => media as SocialMedia) ?? [];
    persistenceEntity.sleepHabits =
      domain.sleepHabits.map((habit) => habit as SleepHabit) ?? [];

    return persistenceEntity;
  }
}
