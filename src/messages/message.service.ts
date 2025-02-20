import { MessageGateway } from './gateway/message.gateway';
import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { MessageRepository } from './infrastructure/persistence/message.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PaginationResult } from '../utils/dto/pagination-result.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './domain/messsage';
import { UsersService } from '../users/users.service';
import { MessageStatus } from './enums/status.enum';
import { UpdateReadAtDto } from './dto/update-read-at.dto';
import { ConversationService } from '../conversations/conversation.service';

@Injectable()
export class MessageService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly usersService: UsersService,
    private readonly messageGateway: MessageGateway,
    private readonly conversationService: ConversationService,
  ) {}

  async create(createDto: CreateMessageDto): Promise<Message> {
    const receiver = await this.usersService.findById(createDto.receiverId);
    const sender = await this.usersService.findById(createDto.senderId);

    if (!receiver) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: { receiverId: 'userNotFound' },
      });
    }

    if (!sender) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: { senderId: 'userNotFound' },
      });
    }

    // Kiểm tra xem đã tồn tại đoạn hội thoại giữa 2 user chưa
    let conversation = await this.conversationService.findBy2UserIds({
      userId1: sender.id,
      userId2: receiver.id,
    });

    // Nếu chưa có đoạn hội thoại thì tạo mới
    if (!conversation) {
      conversation = await this.conversationService.create(
        { user1Id: sender.id, user2Id: receiver.id },
        null,
      );
    }

    // Tạo tin nhắn mới
    const newMessage = new Message();
    newMessage.sender = sender;
    newMessage.receiver = receiver;
    newMessage.messageContent = createDto.messageContent;
    newMessage.status = MessageStatus.SENT;
    newMessage.createdAt = new Date();
    newMessage.conversation = conversation;

    this.messageGateway.sendMessageToUser(newMessage.receiver.id, {
      senderId: newMessage.sender.id,
      content: newMessage.messageContent,
    });

    const createdMessage = await this.messageRepository.create(newMessage);

    await this.conversationService.updateLastMessage(
      conversation.id,
      createdMessage,
    );

    return createdMessage;
  }

  async findManyWithPagination({
    senderId,
    receiverId,
    paginationOptions,
  }: {
    senderId: Message['id'];
    receiverId: Message['id'];
    paginationOptions: IPaginationOptions;
  }): Promise<PaginationResult<Message>> {
    return this.messageRepository.findManyWithPagination({
      userId1: senderId,
      userId2: receiverId,
      paginationOptions,
    });
  }

  async update(
    id: Message['id'],
    updateMessageDto: UpdateMessageDto,
  ): Promise<Message | null> {
    return this.messageRepository.update(id, updateMessageDto);
  }

  async remove(id: Message['id']): Promise<void> {
    await this.messageRepository.remove(id);
  }

  async markMessagesAsRead(updateReadAtDto: UpdateReadAtDto): Promise<void> {
    const { senderId, receiverId } = updateReadAtDto;

    const latestUnreadMessage =
      await this.messageRepository.findLatestUnreadMessage(
        senderId,
        receiverId,
      );

    if (!latestUnreadMessage) {
      return;
    }

    await this.messageRepository.markMessagesAsRead(
      senderId,
      receiverId,
      latestUnreadMessage.createdAt,
    );
  }
}
