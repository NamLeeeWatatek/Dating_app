import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { PaginationResult } from '../../../utils/dto/pagination-result.dto';
import { Message } from '../../domain/messsage';
import { User } from '../../../users/domain/user';

export abstract class MessageRepository {
  abstract create(data: Omit<Message, 'id' | 'createdAt'>): Promise<Message>;
  abstract findManyWithPagination({
    userId1,
    userId2,
    paginationOptions,
  }: {
    userId1: Message['id'];
    userId2: Message['id'];
    paginationOptions: IPaginationOptions;
  }): Promise<PaginationResult<Message>>;

  abstract update(
    id: Message['id'],
    payload: DeepPartial<Message>,
  ): Promise<Message | null>;

  abstract remove(id: Message['id']): Promise<void>;

  abstract findLatestUnreadMessage(
    senderId: User['id'],
    receiverId: User['id'],
  ): Promise<Message | null>;

  abstract markMessagesAsRead(
    senderId: User['id'],
    receiverId: User['id'],
    lastMessageTime: Date,
  ): Promise<void>;
}
