import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { User } from '../../users/domain/user';

export class UpdateReadAtDto {
  @ApiProperty({
    type: String,
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  senderId: User['id'];

  @ApiProperty({
    type: String,
    example: '660e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  receiverId: User['id'];
}
