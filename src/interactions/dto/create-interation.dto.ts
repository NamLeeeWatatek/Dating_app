import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { InteractionType } from '../enums/interaction.enum';

export class CreateInteractionDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID của người gửi tương tác',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  senderId: string;

  @ApiProperty({
    example: '987e6543-e21b-45d3-a789-654321098765',
    description: 'ID của người nhận tương tác',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  receiverId: string;

  @ApiProperty({
    example: InteractionType.LIKE,
    description: 'Loại tương tác (LIKE, DISLIKE, MATCH)',
    enum: InteractionType,
  })
  @IsNotEmpty()
  @IsEnum(InteractionType)
  type: InteractionType;
}
