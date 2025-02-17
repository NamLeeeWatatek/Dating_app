import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsArray,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type, Transform, plainToInstance } from 'class-transformer';
import { Gender } from '../../profiles/enums/gender.enum';

export class FilterDiscoveryDto {
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  gender?: Gender;

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

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  gender?: Gender;

  @ApiPropertyOptional({ type: [Number] })
  @IsOptional()
  @IsArray()
  ageRange?: [number, number];

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? parseFloat(value) : undefined)) // Chuyển giá trị thành số thực
  distanceRange?: number;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Transform(({ value }) => {
    return value
      ? plainToInstance(SortDiscoveryDto, JSON.parse(value))
      : undefined;
  })
  // @ApiPropertyOptional({ type: () => FilterDiscoveryDto }) // Đảm bảo Swagger hiểu kiểu dữ liệu
  // @IsOptional()
  // @ValidateNested()
  // @Type(() => FilterDiscoveryDto)
  // filter?: FilterDiscoveryDto;
  @ValidateNested({ each: true })
  @Type(() => SortDiscoveryDto)
  sort?: SortDiscoveryDto[];
}
