import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { PaginationResult } from '../../../utils/dto/pagination-result.dto';
import { Conversation } from '../../domain/conversation';
import { User } from '../../../users/domain/user';
import { Message } from '../../../messages/domain/messsage';

export abstract class ConversationRepository {
  abstract create(
    data: Omit<Conversation, 'id' | 'createdAt'>,
  ): Promise<Conversation>;

  abstract findManyWithPaginationByUserId({
    userId,
    paginationOptions,
  }: {
    userId: User['id'];
    paginationOptions: IPaginationOptions;
  }): Promise<PaginationResult<Conversation>>;

  abstract findBy2UserIds({
    userId1,
    userId2,
  }: {
    userId1: User['id'];
    userId2: User['id'];
  }): Promise<Conversation | null>;

  abstract updateLastMessage(
    id: Conversation['id'],
    message: Message,
  ): Promise<void>;

  abstract remove(id: Conversation['id']): Promise<void>;

  // abstract findLatestUnreadMessage(
  //   senderId: User['id'],
  //   receiverId: User['id'],
  // ): Promise<Message | null>;

  // abstract markMessagesAsRead(
  //   senderId: User['id'],
  //   receiverId: User['id'],
  //   lastMessageTime: Date,
  // ): Promise<void>;
}
