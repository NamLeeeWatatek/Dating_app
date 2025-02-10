import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';
import { Profile } from '../../../../domain/profile';
import { ProfileEntity } from '../entities/profile.entity';

export class ProfileMapper {
  static toDomain(entity: ProfileEntity): Profile {
    const domainEntity = new Profile();
    domainEntity.id = entity.id;
    domainEntity.user = UserMapper.toDomain(entity.user);
    domainEntity.displayName = entity.displayName;
    domainEntity.age = entity.age;
    domainEntity.gender = entity.gender;
    domainEntity.bio = entity.bio;
    domainEntity.location = entity.location;
    domainEntity.interests = entity.interests;
    domainEntity.files = entity.files;
    domainEntity.createdAt = entity.createdAt;
    domainEntity.updatedAt = entity.updatedAt;
    domainEntity.isPublic = entity.isPublic;
    domainEntity.location = entity.location;
    domainEntity.longitude = entity.longitude;
    domainEntity.latitude = entity.latitude;

    return domainEntity;
  }

  static toPersistence(domainEntity: Profile): ProfileEntity {
    const persistenceEntity = new ProfileEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.user = UserMapper.toPersistence(domainEntity.user);
    persistenceEntity.displayName = domainEntity.displayName;
    persistenceEntity.age = domainEntity.age;
    persistenceEntity.gender = domainEntity.gender;
    persistenceEntity.location = domainEntity.location;
    persistenceEntity.isPublic = domainEntity.isPublic;
    persistenceEntity.bio = domainEntity.bio;
    persistenceEntity.interests = domainEntity.interests;
    persistenceEntity.files = domainEntity.files;
    persistenceEntity.longitude = domainEntity.longitude;
    persistenceEntity.latitude = domainEntity.latitude;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;
    return persistenceEntity;
  }
}
