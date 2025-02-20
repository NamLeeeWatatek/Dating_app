import { MessageMapper } from '../../../../../messages/infrastructure/persistence/relational/mappers/message.mapper';
import { User } from '../../../../../users/domain/user';
import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';
import { Conversation } from '../../../../domain/conversation';
import { ConversationEntity } from '../entities/conversation.entity';

export class ConversationMapper {
  static toDomain(raw: ConversationEntity): Conversation {
    const domainEntity = new Conversation();
    domainEntity.id = raw.id;

    if (raw.user1) {
      domainEntity.user1 = UserMapper.toDomain(raw.user1);
    } else {
      domainEntity.user1 = new User();
      domainEntity.user1.id = raw.user1Id;
    }

    if (raw.user2) {
      domainEntity.user2 = UserMapper.toDomain(raw.user2);
    } else {
      domainEntity.user2 = new User();
      domainEntity.user2.id = raw.user2Id;
    }

    if (raw.lastMessage) {
      domainEntity.lastMessage = MessageMapper.toDomain(raw.lastMessage);
    }

    return domainEntity;
  }

  static toPersistence(domainEntity: Conversation): ConversationEntity {
    const persistenceEntity = new ConversationEntity();
    persistenceEntity.id = domainEntity.id;
    persistenceEntity.user1Id = domainEntity.user1.id;
    persistenceEntity.user2Id = domainEntity.user2.id;

    if (domainEntity.lastMessage) {
      persistenceEntity.lastMessageId = domainEntity.lastMessage.id;
    }

    return persistenceEntity;
  }
}
