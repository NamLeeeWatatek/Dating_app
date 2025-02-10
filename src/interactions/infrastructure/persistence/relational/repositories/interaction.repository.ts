import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';

import { InteractionEntity } from '../entities/interaction.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';

import { Interaction } from '../../../../domain/interaction';
import { InteractionRepository } from '../../interaction.repository';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { PaginationResult } from '../../../../../utils/dto/pagination-result.dto';
import {
  FilterInteractionDto,
  SortInteractionDto,
} from '../../../../dto/query-interation.dto';
import { InteractionMapper } from '../mappers/interaction.mapper';
import { InteractionType } from '../../../../../utils/enums/interaction.enum';

@Injectable()
export class InteractionsRelationalRepository implements InteractionRepository {
  constructor(
    @InjectRepository(InteractionEntity)
    private readonly interactionsRepository: Repository<InteractionEntity>,
  ) {}

  async checkInteractionStatus(
    userId1: string,
    userId2: string,
  ): Promise<NullableType<Interaction>> {
    const entity = await this.interactionsRepository.findOne({
      where: [
        { senderUserId: userId1, receiverUserId: userId2 },
        { senderUserId: userId2, receiverUserId: userId1 },
      ],
    });
    return entity ? InteractionMapper.toDomain(entity) : null;
  }

  async getSentLikes(
    userId: string,
    paginationOptions: IPaginationOptions,
  ): Promise<PaginationResult<Interaction>> {
    const [entities, totalItems] =
      await this.interactionsRepository.findAndCount({
        where: { senderUserId: userId, type: InteractionType.LIKE },
        skip: (paginationOptions.page - 1) * paginationOptions.limit,
        take: paginationOptions.limit,
      });

    return {
      data: entities.map(InteractionMapper.toDomain),
      totalItems,
    };
  }

  async getReceivedLikes(
    userId: string,
    paginationOptions: IPaginationOptions,
  ): Promise<PaginationResult<Interaction>> {
    const [entities, totalItems] =
      await this.interactionsRepository.findAndCount({
        where: { receiverUserId: userId, type: InteractionType.LIKE },
        skip: (paginationOptions.page - 1) * paginationOptions.limit,
        take: paginationOptions.limit,
      });

    return {
      data: entities.map(InteractionMapper.toDomain),
      totalItems,
    };
  }

  async checkMatch(userId1: string, userId2: string): Promise<boolean> {
    const sentLike = await this.interactionsRepository.findOne({
      where: {
        senderUserId: userId1,
        receiverUserId: userId2,
        type: InteractionType.LIKE,
      },
    });

    const receivedLike = await this.interactionsRepository.findOne({
      where: {
        senderUserId: userId2,
        receiverUserId: userId1,
        type: InteractionType.LIKE,
      },
    });

    return !!sentLike && !!receivedLike;
  }

  async blockUser(blockerId: string, blockedId: string): Promise<Interaction> {
    const blockEntity = this.interactionsRepository.create({
      senderUserId: blockerId,
      receiverUserId: blockedId,
      type: InteractionType.BLOCKED,
    });

    const newBlock = await this.interactionsRepository.save(blockEntity);
    return InteractionMapper.toDomain(newBlock);
  }

  async unblockUser(blockerId: string, blockedId: string): Promise<void> {
    await this.interactionsRepository.delete({
      senderUserId: blockerId,
      receiverUserId: blockedId,
      type: InteractionType.BLOCKED,
    });
  }

  async cancelInteraction(
    senderId: string,
    receiverId: string,
    type: InteractionType,
  ): Promise<void> {
    await this.interactionsRepository.delete({
      senderUserId: senderId,
      receiverUserId: receiverId,
      type,
    });
  }

  async findInteractionsByTargetUser(
    targetUserId: string,
    paginationOptions: IPaginationOptions,
  ): Promise<PaginationResult<Interaction>> {
    const [entities, totalItems] =
      await this.interactionsRepository.findAndCount({
        where: { receiverUserId: targetUserId },
        skip: (paginationOptions.page - 1) * paginationOptions.limit,
        take: paginationOptions.limit,
      });

    return {
      data: entities.map(InteractionMapper.toDomain),
      totalItems,
    };
  }

  async create(data: Interaction): Promise<Interaction> {
    const persistenceModel = InteractionMapper.toPersistence(data);
    const newEntity = await this.interactionsRepository.save(
      this.interactionsRepository.create(persistenceModel),
    );
    return InteractionMapper.toDomain(newEntity);
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterInteractionDto | null;
    sortOptions?: SortInteractionDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<PaginationResult<Interaction>> {
    const where: FindOptionsWhere<InteractionEntity> = {};

    if (filterOptions?.userIds?.length) {
      where.senderUserId = filterOptions.userIds;
    }

    const [entities, totalItems] =
      await this.interactionsRepository.findAndCount({
        skip: (paginationOptions.page - 1) * paginationOptions.limit,
        take: paginationOptions.limit,
        where,
        order: sortOptions?.reduce(
          (accumulator, sort) => ({
            ...accumulator,
            [sort.orderBy]: sort.order,
          }),
          {},
        ),
      });

    return {
      data: entities.map(InteractionMapper.toDomain),
      totalItems,
    };
  }

  async findById(id: Interaction['id']): Promise<NullableType<Interaction>> {
    const entity = await this.interactionsRepository.findOne({ where: { id } });
    return entity ? InteractionMapper.toDomain(entity) : null;
  }

  async findByUserId(userId: string): Promise<Interaction[]> {
    const entities = await this.interactionsRepository.find({
      where: { senderUserId: userId },
    });
    return entities.map(InteractionMapper.toDomain);
  }

  async update(
    id: Interaction['id'],
    payload: Partial<Interaction>,
  ): Promise<Interaction> {
    const entity = await this.interactionsRepository.findOne({ where: { id } });

    if (!entity) {
      throw new Error('Interaction not found');
    }

    const updatedEntity = await this.interactionsRepository.save(
      this.interactionsRepository.create(
        InteractionMapper.toPersistence({
          ...InteractionMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return InteractionMapper.toDomain(updatedEntity);
  }

  async remove(id: Interaction['id']): Promise<void> {
    await this.interactionsRepository.softDelete(id);
  }
}
