import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Transform, Type, plainToInstance } from 'class-transformer';
import { UserDto } from '../../users/dto/user.dto';
import { InteractionType } from '../../utils/enums/interaction.enum';

export class FilterInteractionDto {
  @ApiPropertyOptional({ type: [UserDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UserDto)
  userIds?: string;

  @ApiPropertyOptional({ enum: InteractionType })
  @IsOptional()
  @IsEnum(InteractionType)
  type?: InteractionType;
}

export class SortInteractionDto {
  @ApiPropertyOptional()
  @Type(() => String)
  @IsString()
  orderBy: string;

  @ApiPropertyOptional()
  @IsString()
  order: 'ASC' | 'DESC';
}

export class QueryInteractionDto {
  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Transform(({ value }) =>
    value
      ? plainToInstance(FilterInteractionDto, JSON.parse(value))
      : undefined,
  )
  @ValidateNested()
  @Type(() => FilterInteractionDto)
  filters?: FilterInteractionDto | null;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Transform(({ value }) =>
    value ? plainToInstance(SortInteractionDto, JSON.parse(value)) : undefined,
  )
  @ValidateNested({ each: true })
  @Type(() => SortInteractionDto)
  sort?: SortInteractionDto[] | null;
}
