import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { PotentialMatch } from '../../../../domain/potential-match';
import { PotentialMatchEntity } from '../entities/potential-match.entity';

export class PotentialMatchMapper {
  static toDomain(raw: PotentialMatchEntity): PotentialMatch {
    const domainEntity = new PotentialMatch();
    domainEntity.id = raw.id;
    domainEntity.userId = raw.user.id;
    domainEntity.potentialMatchId = raw.potentialMatch.id;
    domainEntity.matchScore = raw.matchScore;
    domainEntity.createdAt = raw.createdAt;
    return domainEntity;
  }

  static toPersistence(domainEntity: PotentialMatch): PotentialMatchEntity {
    const persistenceEntity = new PotentialMatchEntity();

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }

    const userEntity = new UserEntity();
    userEntity.id = domainEntity.userId;

    const potentialMatchEntity = new UserEntity();
    potentialMatchEntity.id = domainEntity.potentialMatchId;

    persistenceEntity.user = userEntity;
    persistenceEntity.potentialMatch = potentialMatchEntity;
    persistenceEntity.matchScore = domainEntity.matchScore;
    persistenceEntity.createdAt = domainEntity.createdAt;

    return persistenceEntity;
  }
}
