import { ConversationEntity } from '../infrastructure/persistence/relational/entities/conversation.entity';
import { MessageDto } from '../../messages/dto/message.dto';
import { UserProfileDto } from '../../user-profile/dto/user-profile.dto';

export class ConversationDto {
  id: ConversationEntity['id'];

  user1: UserProfileDto;

  user2: UserProfileDto;

  lastMessage: MessageDto | null;

  // constructor(conversation: Conversation) {
  //   this.id = conversation.id;
  //   this.user1 = ;
  //   this.user2 = ;

  //   this.lastMessage = conversation.lastMessage
  //     ? new MessageDto(conversation.lastMessage)
  //     : null;
  // }
}
