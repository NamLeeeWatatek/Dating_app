import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  FilterInteractionDto,
  SortInteractionDto,
} from './dto/query-interation.dto';
import { InteractionRepository } from './infrastructure/persistence/interaction.repository';
import { CreateInteractionDto } from './dto/create-interation.dto';
import { Interaction } from './domain/interaction';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { PaginationResult } from '../utils/dto/pagination-result.dto';
import { NullableType } from '../utils/types/nullable.type';
import { UpdateInteractionDto } from './dto/update-interation.dto';
import { UsersService } from '../users/users.service';
import { InteractionType } from './enums/interaction.enum';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class InteractionsService {
  constructor(
    private readonly interactionsRepository: InteractionRepository,
    private readonly usersService: UsersService,
    private readonly redisService: RedisService,
  ) {}
  private readonly interactionFolder = 'interactions';

  async create(
    createInteractionDto: CreateInteractionDto,
  ): Promise<Interaction> {
    const { senderId, receiverId, type } = createInteractionDto;

    const senderExists = await this.usersService.findById(senderId);
    if (!senderExists) {
      throw new NotFoundException(`Sender with ID ${senderId} not found`);
    }

    const receiverExists = await this.usersService.findById(receiverId);
    if (!receiverExists) {
      throw new NotFoundException(`Receiver with ID ${receiverId} not found`);
    }

    const existingInteraction =
      await this.interactionsRepository.findOneByUserIds(senderId, receiverId);

    if (existingInteraction) {
      throw new ConflictException('Interaction already exists');
    }

    const interaction = await this.interactionsRepository.create({
      senderUserId: senderId,
      receiverUserId: receiverId,
      type,
    });

    // Bước 4: Cập nhật Redis với tương tác mới
    const redisKey = `${senderId}:${receiverId}`;
    await this.redisService.set(
      this.interactionFolder,
      redisKey,
      interaction.type,
      3600,
    ); // Cập nhật Redis

    return interaction;
  }

  async checkInteractionStatus(
    userId1: string,
    userId2: string,
  ): Promise<NullableType<Interaction>> {
    // Bước 1: Kiểm tra trong Redis trước
    const redisKey = `${userId1}:${userId2}`;
    const cachedInteraction = await this.redisService.get(
      this.interactionFolder,
      redisKey,
    );

    if (cachedInteraction && typeof cachedInteraction === 'string') {
      return JSON.parse(cachedInteraction);
    }

    // Bước 2: Nếu không có trong Redis, lấy từ Database
    const interaction =
      await this.interactionsRepository.checkInteractionStatus(
        userId1,
        userId2,
      );

    if (!interaction) {
      return null; // Nếu không có trong DB, trả về null
    }

    // Bước 3: Lưu kết quả vào Redis
    await this.redisService.set(
      this.interactionFolder,
      redisKey,
      JSON.stringify(interaction),
      3600,
    ); // Lưu vào Redis trong 1 giờ

    return interaction; // Trả về từ DB
  }

  async getSentLikes(
    userId: string,
    paginationOptions: IPaginationOptions,
  ): Promise<PaginationResult<Interaction>> {
    return this.interactionsRepository.getSentLikes(userId, paginationOptions);
  }

  // 📜 Lấy danh sách lượt thích đã nhận
  async getReceivedLikes(
    userId: string,
    paginationOptions: IPaginationOptions,
  ): Promise<PaginationResult<Interaction>> {
    return this.interactionsRepository.getReceivedLikes(
      userId,
      paginationOptions,
    );
  }

  // ✅ Kiểm tra hai người dùng có match hay không
  async checkMatch(userId1: string, userId2: string): Promise<boolean> {
    return this.interactionsRepository.checkMatch(userId1, userId2);
  }

  // 🚫 Chặn người dùng
  async blockUser(blockerId: string, blockedId: string): Promise<Interaction> {
    return this.interactionsRepository.blockUser(blockerId, blockedId);
  }

  // 🔓 Bỏ chặn người dùng
  async unblockUser(blockerId: string, blockedId: string): Promise<void> {
    return this.interactionsRepository.unblockUser(blockerId, blockedId);
  }

  // ❌ Hủy một tương tác (ví dụ: rút like)
  async cancelInteraction(
    senderId: string,
    receiverId: string,
    type: InteractionType,
  ): Promise<void> {
    return this.interactionsRepository.cancelInteraction(
      senderId,
      receiverId,
      type,
    );
  }

  // 📌 Lấy danh sách tương tác với phân trang
  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterInteractionDto | null;
    sortOptions?: SortInteractionDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<PaginationResult<Interaction>> {
    return this.interactionsRepository.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }

  // 🔍 Tìm một tương tác theo ID
  async findById(id: Interaction['id']): Promise<NullableType<Interaction>> {
    const interaction = await this.interactionsRepository.findById(id);
    if (!interaction) {
      throw new NotFoundException('Interaction not found');
    }
    return interaction;
  }

  // 🔍 Tìm tất cả tương tác của một người dùng
  async findByUserId(userId: string): Promise<Interaction[]> {
    return this.interactionsRepository.findByUserId(userId);
  }

  // 📜 Lấy danh sách tương tác của một người dùng cụ thể
  async findInteractionsByTargetUser(
    targetUserId: string,
    paginationOptions: IPaginationOptions,
  ): Promise<PaginationResult<Interaction>> {
    return this.interactionsRepository.findInteractionsByTargetUser(
      targetUserId,
      paginationOptions,
    );
  }

  // 🔄 Cập nhật một tương tác
  async update(
    id: Interaction['id'],
    updateInteractionDto: UpdateInteractionDto,
  ): Promise<Interaction | null> {
    const interaction = await this.interactionsRepository.findById(id);
    if (!interaction) {
      throw new NotFoundException('Interaction not found');
    }

    if (updateInteractionDto.senderId) {
      const senderExists = await this.usersService.findById(
        updateInteractionDto.senderId,
      );
      if (!senderExists) {
        throw new NotFoundException(
          `Sender with ID ${updateInteractionDto.senderId} not found`,
        );
      }
    }

    if (updateInteractionDto.receiverId) {
      const receiverExists = await this.usersService.findById(
        updateInteractionDto.receiverId,
      );
      if (!receiverExists) {
        throw new NotFoundException(
          `Receiver with ID ${updateInteractionDto.receiverId} not found`,
        );
      }
    }

    return this.interactionsRepository.update(id, {
      type: updateInteractionDto.type,
      senderUserId: updateInteractionDto.senderId ?? interaction.senderUserId,
      receiverUserId:
        updateInteractionDto.receiverId ?? interaction.receiverUserId,
    });
  }

  // 🗑️ Xóa một tương tác
  async remove(id: Interaction['id']): Promise<void> {
    const interaction = await this.interactionsRepository.findById(id);
    if (!interaction) {
      throw new NotFoundException('Interaction not found');
    }

    await this.interactionsRepository.remove(id);
  }
}
