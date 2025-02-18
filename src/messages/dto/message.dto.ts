import { User } from '../../users/domain/user';
import { Message } from '../domain/messsage';
import { MessageStatus } from '../enums/status.enum';

export class MessageDto {
  id: User['id'];

  messageContent: string;

  createdAt: Date;

  status: MessageStatus;

  readAt: Date | null;

  senderId: User['id'];

  receiverId: User['id'];

  constructor(message: Message) {
    this.id = message.id;
    this.messageContent = message.messageContent;
    this.status = message.status;
    this.readAt = message.readAt;
    this.senderId = message.sender.id;
    this.receiverId = message.id;
  }
}
