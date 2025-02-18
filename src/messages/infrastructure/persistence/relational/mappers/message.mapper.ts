import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';
import { Message } from '../../../../domain/messsage';
import { MessageEntity } from '../entities/message.entity';

export class MessageMapper {
  static toDomain(raw: MessageEntity): Message {
    console.log('raw: ', raw);
    const domainEntity = new Message();
    domainEntity.id = raw.id;
    domainEntity.messageContent = raw.messageContent;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.status = raw.status;
    domainEntity.readAt = raw.readAt;

    if (raw.sender) domainEntity.sender = UserMapper.toDomain(raw.sender);
    if (raw.receiver) domainEntity.receiver = UserMapper.toDomain(raw.receiver);

    console.log('first,', domainEntity);

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

    return persistenceEntity;
  }
}
