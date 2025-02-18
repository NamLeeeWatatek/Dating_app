import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  senderId: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  receiverId: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  messageContent: string;
}
