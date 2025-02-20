// import { Type } from 'class-transformer';
// import { StatusDto } from '../../statuses/dto/status.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsEnum,
  IsString,
  IsBoolean,
  IsLatitude,
  IsLongitude,
} from 'class-validator';
import { Gender } from '../enums/gender.enum';
import { SexualOrientation } from '../enums/sexual-orientation.enum';

export class CreateProfileDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsString()
  userId: string;

  @ApiProperty({ example: 'JohnDoe99', type: String })
  @IsNotEmpty()
  @IsString()
  displayName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  isPublic: boolean;

  @ApiProperty({ example: 25, type: Number })
  @IsInt()
  @Min(18)
  @Max(100)
  age: number;

  @ApiProperty({ example: Gender.MALE, enum: Gender })
  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({
    example: [SexualOrientation.MALE],
    enum: SexualOrientation,
    isArray: true,
  })
  @IsNotEmpty()
  @IsEnum(SexualOrientation, { each: true }) // Kiểm tra từng phần tử trong mảng
  sexualOrientation: SexualOrientation[];

  @ApiPropertyOptional({ example: 'Loves hiking and coffee', type: String })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ example: 37.7749, type: Number })
  @IsOptional()
  @IsLatitude()
  latitude?: number;

  @ApiPropertyOptional({ example: -122.4194, type: Number })
  @IsOptional()
  @IsLongitude()
  longitude?: number;
}
