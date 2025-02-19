import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsArray, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class FilterDiscoveryDto {
  @ApiPropertyOptional({ type: [Number] })
  @IsOptional()
  @IsArray()
  ageRange?: [number, number];
  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber()
  distanceRange?: number;
}

export class SortDiscoveryDto {
  @ApiProperty()
  @IsString()
  orderBy: string;

  @ApiProperty()
  @IsString()
  order: string;
}

export class QueryDiscoveryDto {
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

  @ApiPropertyOptional({ type: [Number] })
  @IsOptional()
  @IsArray()
  ageRange?: [number, number];

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? parseFloat(value) : undefined)) // Chuyển giá trị thành số thực
  distanceRange?: number;
}
