import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Transform, Type, plainToInstance } from 'class-transformer';
import { Profile } from '../domain/profile';
import { UserDto } from '../../users/dto/user.dto';

export class FilterProfileDto {
  @ApiPropertyOptional({ type: [UserDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UserDto)
  users?: UserDto[] | null;
}

export class SortProfileDto {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  orderBy: keyof Profile;

  @ApiProperty()
  @IsString()
  order: string;
}

export class QueryProfileDto {
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
    value ? plainToInstance(FilterProfileDto, JSON.parse(value)) : undefined,
  )
  @ValidateNested()
  @Type(() => FilterProfileDto)
  filters?: FilterProfileDto | null;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Transform(({ value }) => {
    return value
      ? plainToInstance(SortProfileDto, JSON.parse(value))
      : undefined;
  })
  @ValidateNested({ each: true })
  @Type(() => SortProfileDto)
  sort?: SortProfileDto[] | null;
}
