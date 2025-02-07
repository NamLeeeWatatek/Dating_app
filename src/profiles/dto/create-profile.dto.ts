import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsEnum,
  IsArray,
  IsString,
} from 'class-validator';
import { StatusDto } from '../../statuses/dto/status.dto';
import { Gender } from '../../utils/enums/gender';

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

  @ApiProperty({ example: 25, type: Number })
  @IsInt()
  @Min(18)
  @Max(100)
  age: number;

  @ApiProperty({ example: Gender.MALE, enum: Gender })
  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  @ApiPropertyOptional({ example: 'Loves hiking and coffee', type: String })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({ example: ['Sports', 'Music'], type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  interests?: string[];

  // @ApiPropertyOptional({ type: () => FileDto })
  // @IsOptional()
  // photo?: FileDto | null;

  @ApiPropertyOptional({ type: StatusDto })
  @IsOptional()
  @Type(() => StatusDto)
  status?: StatusDto;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
