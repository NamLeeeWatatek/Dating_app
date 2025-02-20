import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class FindConversationQueryDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  userId1: string;

  @ApiProperty({ example: '660f8400-a99b-41c8-b616-556677880000' })
  @IsUUID()
  userId2: string;
}
