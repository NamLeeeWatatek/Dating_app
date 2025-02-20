import { Conversation } from '../../../../../conversations/domain/conversation';
import { ConversationMapper } from '../../../../../conversations/infrastructure/persistence/relational/mappers/conversation.mapper';
import { User } from '../../../../../users/domain/user';
import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';
import { Message } from '../../../../domain/messsage';
import { MessageEntity } from '../entities/message.entity';

export class MessageMapper {
  static toDomain(raw: MessageEntity): Message {
    const domainEntity = new Message();
    domainEntity.id = raw.id;
    domainEntity.messageContent = raw.messageContent;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.status = raw.status;
    domainEntity.readAt = raw.readAt;

    if (raw.sender) {
      domainEntity.sender = UserMapper.toDomain(raw.sender);
    } else {
      domainEntity.sender = new User();
      domainEntity.sender.id = raw.senderId;
    }
    if (raw.receiver) {
      domainEntity.receiver = UserMapper.toDomain(raw.receiver);
    } else {
      domainEntity.receiver = new User();
      domainEntity.receiver.id = raw.receiverId;
    }

    if (raw.conversation) {
      domainEntity.conversation = ConversationMapper.toDomain(raw.conversation);
    } else {
      domainEntity.conversation = new Conversation();
      domainEntity.conversation.id = raw.conversationId;
    }

    return domainEntity;
  }

  static toPersistence(domainEntity: Message): MessageEntity {
    const persistenceEntity = new MessageEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }

    persistenceEntity.messageContent = domainEntity.messageContent;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.status = domainEntity.status;
    persistenceEntity.readAt = domainEntity.readAt;

    persistenceEntity.sender = UserMapper.toPersistence(domainEntity.sender);
    persistenceEntity.receiver = UserMapper.toPersistence(
      domainEntity.receiver,
    );

    persistenceEntity.conversation = ConversationMapper.toPersistence(
      domainEntity.conversation,
    );

    return persistenceEntity;
  }
}
