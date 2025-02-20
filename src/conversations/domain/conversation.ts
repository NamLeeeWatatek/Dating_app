import { Message } from '../../messages/domain/messsage';
import { User } from '../../users/domain/user';
import { ConversationEntity } from '../infrastructure/persistence/relational/entities/conversation.entity';

export class Conversation {
  id: ConversationEntity['id'];

  user1: User;

  user2: User;

  lastMessage: Message | null;
}
