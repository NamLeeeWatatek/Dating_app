import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { User } from '../../../../../users/domain/user';
import { ConversationRepository } from '../../conversation.repository';
import { ConversationEntity } from '../entities/conversation.entity';
import { Conversation } from '../../../../domain/conversation';
import { ConversationMapper } from '../mappers/conversation.mapper';
import { Message } from '../../../../../messages/domain/messsage';

@Injectable()
export class ConversationRelationalRepository
  implements ConversationRepository
{
  constructor(
    @InjectRepository(ConversationEntity)
    private readonly conversationRepository: Repository<ConversationEntity>,
  ) {}

  async create(data: Conversation): Promise<Conversation> {
    const persistenceModel = ConversationMapper.toPersistence(data);
    const newEntity = await this.conversationRepository.save(
      this.conversationRepository.create(persistenceModel),
    );
    return ConversationMapper.toDomain(newEntity);
  }

  async findManyWithPaginationByUserId({
    userId,
    paginationOptions,
  }: {
    userId: User['id'];
    paginationOptions: IPaginationOptions;
  }): Promise<{ data: Conversation[]; totalItems: number }> {
    const [entities, totalItems] =
      await this.conversationRepository.findAndCount({
        skip: (paginationOptions.page - 1) * paginationOptions.limit,
        take: paginationOptions.limit,
        where: [{ user1Id: userId }, { user2Id: userId }],
        order: { lastMessage: { createdAt: 'DESC' } },
        relations: ['lastMessage', 'user1', 'user2'],
      });

    return {
      data: entities.map((conversation) =>
        ConversationMapper.toDomain(conversation),
      ),
      totalItems,
    };
  }

  async findBy2UserIds({
    userId1,
    userId2,
  }: {
    userId1: User['id'];
    userId2: User['id'];
  }): Promise<Conversation | null> {
    const conversation = await this.conversationRepository.findOne({
      where: [
        { user1Id: userId1, user2Id: userId2 },
        { user1Id: userId2, user2Id: userId1 },
      ],
      relations: ['lastMessage', 'user1', 'user2', 'messages'],
      order: { lastMessage: { createdAt: 'DESC' } },
    });

    return conversation ? ConversationMapper.toDomain(conversation) : null;
  }

  async updateLastMessage(
    id: Conversation['id'],
    message: Message,
  ): Promise<void> {
    await this.conversationRepository.update(id, {
      lastMessageId: message.id,
    });
  }

  async remove(id: Conversation['id']): Promise<void> {
    const conversation = await this.conversationRepository.findOne({
      where: { id },
    });
    if (!conversation) throw new NotFoundException('Conversation not found');

    await this.conversationRepository.remove(conversation);
  }
}
