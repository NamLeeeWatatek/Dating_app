import { IPaginationOptions } from './types/pagination-options';
import { InfinityPaginationResponseDto } from './dto/infinity-pagination-response.dto';

export const infinityPagination = <T>(
  data: T[],
  totalItems: number,
  options: IPaginationOptions,
): InfinityPaginationResponseDto<T> => {
  const totalPages = Math.ceil(totalItems / options.limit);

  return {
    data,
    totalItems,
    totalPages,
    currentPage: options.page,
    pageSize: options.limit,
    hasNextPage: options.page < totalPages,
    hasPreviousPage: options.page > 1,
  };
};
