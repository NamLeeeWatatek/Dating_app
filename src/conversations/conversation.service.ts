import { Injectable, NotFoundException } from '@nestjs/common';
import { ConversationRepository } from './infrastructure/persistence/conversation.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { PaginationResult } from '../utils/dto/pagination-result.dto';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { Conversation } from './domain/conversation';
import { UserRepository } from '../users/infrastructure/persistence/user.repository';
import { User } from '../users/domain/user';
import { Message } from '../messages/domain/messsage';
import { UserProfileService } from '../user-profile/user-profile.service';
import { ConversationDto } from './dto/conversation.dto';
import { MessageDto } from '../messages/dto/message.dto';

@Injectable()
export class ConversationService {
  constructor(
    private readonly conversationRepository: ConversationRepository,
    private readonly userRepository: UserRepository,
    private readonly userProfileService: UserProfileService,
  ) {}

  async create(
    createDto: CreateConversationDto,
    lastMessage: Message | null,
  ): Promise<Conversation> {
    const { user1Id, user2Id } = createDto;

    const user1 = await this.userRepository.findById(user1Id);
    const user2 = await this.userRepository.findById(user2Id);

    if (!user1 || !user2) {
      throw new NotFoundException('One or both users not found');
    }

    const conversation = new Conversation();
    conversation.user1 = user1;
    conversation.user2 = user2;
    conversation.lastMessage = lastMessage;

    const conversationEntity =
      await this.conversationRepository.create(conversation);

    return conversationEntity;
  }

  async getConversationDto(
    conversation: Conversation,
  ): Promise<ConversationDto> {
    const user1 = await this.userProfileService.getUserWithProfile(
      conversation.user1.id,
    );
    if (!user1)
      throw new NotFoundException(
        `User1 with ID ${conversation.user1.id} not found`,
      );

    const user2 = await this.userProfileService.getUserWithProfile(
      conversation.user2.id,
    );
    if (!user2)
      throw new NotFoundException(
        `User2 with ID ${conversation.user2.id} not found`,
      );

    const conversationDto = new ConversationDto();

    conversationDto.id = conversation.id;
    conversationDto.user1 = user1;
    conversationDto.user2 = user2;
    conversationDto.lastMessage = conversation.lastMessage
      ? new MessageDto(conversation.lastMessage)
      : null;

    return conversationDto;
  }

  async findManyWithPaginationByUserId({
    userId,
    paginationOptions,
  }: {
    userId: User['id'];
    paginationOptions: IPaginationOptions;
  }): Promise<PaginationResult<ConversationDto>> {
    const conversations =
      await this.conversationRepository.findManyWithPaginationByUserId({
        userId,
        paginationOptions,
      });

    const conversationDtos = await Promise.all(
      conversations.data.map((conversation) =>
        this.getConversationDto(conversation),
      ),
    );

    return {
      data: conversationDtos,
      totalItems: conversations.totalItems,
    };
  }

  async findBy2UserIds({
    userId1,
    userId2,
  }: {
    userId1: User['id'];
    userId2: User['id'];
  }): Promise<Conversation | null> {
    return this.conversationRepository.findBy2UserIds({
      userId1,
      userId2,
    });
  }

  async updateLastMessage(
    id: Conversation['id'],
    message: Message,
  ): Promise<void> {
    await this.conversationRepository.updateLastMessage(id, message);
  }

  async remove(id: Conversation['id']): Promise<void> {
    await this.conversationRepository.remove(id);
  }
}
