import { UserMapper } from '../../../../users/infrastructure/persistence/relational/mappers/user.mapper';
import { Match } from '../../../domain/match';
import { MatchesEntity } from '../entities/match.entity';

export class MatchMapper {
  static toDomain(entity: MatchesEntity): Match {
    return new Match(
      entity.id,
      entity.user.id,
      entity.matchedUser.id,
      entity.matchedAt,
    );
  }

  static toPersistence(domainEntity: Match): MatchesEntity {
    const entity = new MatchesEntity();
    entity.id = domainEntity.id;
    entity.user = UserMapper.toPersistence({ id: domainEntity.userId } as any);
    entity.matchedUser = UserMapper.toPersistence({
      id: domainEntity.matchedUserId,
    } as any);
    entity.matchedAt = domainEntity.matchedAt;
    return entity;
  }
}
