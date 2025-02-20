import { User } from '../../users/domain/user';
import { Conversation } from '../domain/conversation';
import { ConversationEntity } from '../infrastructure/persistence/relational/entities/conversation.entity';
import { MessageDto } from '../../messages/dto/message.dto';

export class ConversationDto {
  id: ConversationEntity['id'];

  user1: User;

  user2: User;

  lastMessage: MessageDto | null;

  constructor(conversation: Conversation) {
    this.id = conversation.id;
    this.user1 = conversation.user1;
    this.user2 = conversation.user2;

    this.lastMessage = conversation.lastMessage
      ? new MessageDto(conversation.lastMessage)
      : null;
  }
}
