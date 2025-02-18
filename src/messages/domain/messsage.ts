import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { User } from '../../users/domain/user';
import { MessageStatus } from '../enums/status.enum';

export class Message {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: String,
    example: 'Hello, how are you?',
  })
  @Expose()
  messageContent: string;

  @ApiProperty({
    type: Date,
    example: '2024-02-17T12:00:00Z',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    type: String,
  })
  @Expose()
  status: MessageStatus;

  @ApiProperty({
    type: Date,
    example: '2024-02-17T12:30:00Z',
    nullable: true,
  })
  @Expose()
  readAt: Date | null;

  @ApiProperty({
    type: () => User,
  })
  @Expose()
  sender: User;

  @ApiProperty({
    type: () => User,
  })
  @Expose()
  receiver: User;
}
