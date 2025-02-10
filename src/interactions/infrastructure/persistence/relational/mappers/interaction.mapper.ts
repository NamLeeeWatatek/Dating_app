import { Interaction } from '../../../../domain/interaction';
import { InteractionEntity } from '../entities/interaction.entity';

export class InteractionMapper {
  static toDomain(entity: InteractionEntity): Interaction {
    return {
      id: entity.id,
      senderUserId: entity.senderUserId,
      receiverUserId: entity.receiverUserId,
      type: entity.type,
      createdAt: entity.createdAt,
    };
  }

  static toPersistence(domainEntity: Interaction): InteractionEntity {
    const persistenceEntity = new InteractionEntity();

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }

    persistenceEntity.senderUserId = domainEntity.senderUserId;
    persistenceEntity.receiverUserId = domainEntity.receiverUserId;
    persistenceEntity.type = domainEntity.type;
    persistenceEntity.createdAt = domainEntity.createdAt;

    return persistenceEntity;
  }
}
