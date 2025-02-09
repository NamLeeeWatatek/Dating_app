import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { InteractionType } from '../../utils/enums/interaction.enum';
import { CreateInteractionDto } from './create-interation.dto';

export class UpdateInteractionDto extends PartialType(CreateInteractionDto) {
  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsOptional()
  @IsUUID()
  interactionId?: string;

  @ApiPropertyOptional({ enum: InteractionType })
  @IsOptional()
  @IsEnum(InteractionType)
  type?: InteractionType;
}
