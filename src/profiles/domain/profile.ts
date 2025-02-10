import { User } from '../../users/domain/user';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender } from '../../utils/enums/gender.enum';
import { IsLatitude, IsLongitude, IsOptional } from 'class-validator';

export class Profile {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: () => User })
  user: User;

  @ApiProperty({ type: String, example: 'John Doe' })
  displayName: string;

  @ApiProperty({ type: Boolean })
  isPublic: boolean;

  @ApiProperty({ type: Number, example: 25 })
  age: number;

  @ApiProperty({ type: String, example: Gender.MALE })
  gender: Gender;

  @ApiProperty({ type: String, nullable: true })
  bio?: string;

  @ApiProperty({ type: [String], example: ['reading', 'music'] })
  interests?: string[];

  @ApiProperty({ type: String, nullable: true })
  avatarUrl?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  location?: string;

  @ApiPropertyOptional({ example: 37.7749, type: Number })
  @IsOptional()
  @IsLatitude()
  latitude?: number;

  @ApiPropertyOptional({ example: -122.4194, type: Number })
  @IsOptional()
  @IsLongitude()
  longitude?: number;

  @ApiProperty()
  updatedAt: Date;
}
