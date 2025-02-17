import { NullableType } from '../../../utils/types/nullable.type';
import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { Interaction } from '../../domain/interaction';

import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { PaginationResult } from '../../../utils/dto/pagination-result.dto';
import {
  FilterInteractionDto,
  SortInteractionDto,
} from '../../dto/query-interation.dto';

export abstract class InteractionRepository {
  abstract create(
    data: Omit<Interaction, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Interaction>;

  abstract findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterInteractionDto | null;
    sortOptions?: SortInteractionDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<PaginationResult<Interaction>>;

  abstract findById(id: Interaction['id']): Promise<NullableType<Interaction>>;

  abstract findByUserId(userId: string): Promise<Interaction[]>;

  abstract findInteractionsByTargetUser(
    targetUserId: string,
    paginationOptions: IPaginationOptions,
  ): Promise<PaginationResult<Interaction>>;

  abstract update(
    id: Interaction['id'],
    payload: DeepPartial<Interaction>,
  ): Promise<Interaction | null>;

  abstract remove(id: Interaction['id']): Promise<void>;

  /**
   * Kiểm tra trạng thái tương tác giữa hai người dùng
   */
  abstract checkInteractionStatus(
    userId1: string,
    userId2: string,
  ): Promise<NullableType<Interaction>>;

  /**
   * Lấy danh sách lượt thích đã gửi
   */
  abstract getSentLikes(
    userId: string,
    paginationOptions: IPaginationOptions,
  ): Promise<PaginationResult<Interaction>>;

  /**
   * Lấy danh sách lượt thích đã nhận
   */
  abstract getReceivedLikes(
    userId: string,
    paginationOptions: IPaginationOptions,
  ): Promise<PaginationResult<Interaction>>;

  /**
   * Kiểm tra match giữa hai người dùng
   */
  abstract checkMatch(userId1: string, userId2: string): Promise<boolean>;

  /**
   * Chặn người dùng
   */
  abstract blockUser(
    blockerId: string,
    blockedId: string,
  ): Promise<Interaction>;

  /**
   * Bỏ chặn người dùng
   */
  abstract unblockUser(blockerId: string, blockedId: string): Promise<void>;

  /**
   * Hủy tương tác (like, super like, match)
   */
  abstract cancelInteraction(
    senderId: string,
    receiverId: string,
    type: string,
  ): Promise<void>;

  abstract findOneByUserIds(
    senderId: string,
    receiverId: string,
  ): Promise<NullableType<Interaction>>;
}
