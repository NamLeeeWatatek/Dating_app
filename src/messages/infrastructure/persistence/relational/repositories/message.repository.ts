import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, In, IsNull, Repository } from 'typeorm';

import { MessageRepository } from '../../message.repository';
import { MessageEntity } from '../entities/message.entity';
import { Message } from '../../../../domain/messsage';
import { MessageMapper } from '../mappers/message.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { User } from '../../../../../users/domain/user';

@Injectable()
export class MessageRelationalRepository implements MessageRepository {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
  ) {}

  async create(data: Message): Promise<Message> {
    const persistenceModel = MessageMapper.toPersistence(data);
    const newEntity = await this.messageRepository.save(
      this.messageRepository.create(persistenceModel),
    );
    return MessageMapper.toDomain(newEntity);
  }

  async findManyWithPagination({
    userId1,
    userId2,
    paginationOptions,
  }: {
    userId1: Message['id'];
    userId2: Message['id'];
    paginationOptions: IPaginationOptions;
  }): Promise<{ data: Message[]; totalItems: number }> {
    const where: FindOptionsWhere<MessageEntity> = {
      senderId: In([userId1, userId2]),
      receiverId: In([userId1, userId2]),
    };

    const [entities, totalItems] = await this.messageRepository.findAndCount({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where,
      order: { createdAt: 'DESC' },
      relations: ['sender', 'receiver'],
    });

    console.log('helooo', entities);

    return {
      data: entities.map((message) => MessageMapper.toDomain(message)),
      totalItems,
    };
  }

  async update(id: Message['id'], payload: Partial<Message>): Promise<Message> {
    const entity = await this.messageRepository.findOne({
      where: { id: id },
    });

    if (!entity) {
      throw new Error('Message not found');
    }

    const updatedEntity = await this.messageRepository.save(
      this.messageRepository.create(
        MessageMapper.toPersistence({
          ...MessageMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return MessageMapper.toDomain(updatedEntity);
  }

  async remove(id: Message['id']): Promise<void> {
    await this.messageRepository.softDelete(id);
  }

  async findLatestUnreadMessage(
    senderId: User['id'],
    receiverId: User['id'],
  ): Promise<Message | null> {
    return this.messageRepository.findOne({
      where: { senderId, receiverId, readAt: IsNull() },
      order: { createdAt: 'DESC' },
      select: ['createdAt'],
    });
  }

  async markMessagesAsRead(
    senderId: User['id'],
    receiverId: User['id'],
    lastMessageTime: Date,
  ): Promise<void> {
    await this.messageRepository
      .createQueryBuilder()
      .update()
      .set({ readAt: new Date() })
      .where(
        'senderId = :senderId AND receiverId = :receiverId AND readAt IS NULL AND createdAt <= :lastMessageTime',
        { senderId, receiverId, lastMessageTime },
      )
      .execute();
  }
}
