import { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class InfinityPaginationResponseDto<T> {
  @ApiProperty()
  totalItems: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  currentPage: number;

  @ApiProperty()
  pageSize: number;

  @ApiProperty()
  hasNextPage: boolean;

  @ApiProperty()
  hasPreviousPage: boolean;

  @ApiProperty({ type: [Object] }) // T sẽ được xác định động
  data: T[];
}

export function InfinityPaginationResponse<T>(classReference: Type<T>) {
  abstract class Pagination {
    @ApiProperty()
    totalItems: number;

    @ApiProperty()
    totalPages: number;

    @ApiProperty()
    currentPage: number;

    @ApiProperty()
    pageSize: number;

    @ApiProperty()
    hasNextPage: boolean;

    @ApiProperty()
    hasPreviousPage: boolean;

    @ApiProperty({ type: [classReference] })
    data!: T[];
  }

  Object.defineProperty(Pagination, 'name', {
    writable: false,
    value: `InfinityPagination${classReference.name}ResponseDto`,
  });

  return Pagination;
}
