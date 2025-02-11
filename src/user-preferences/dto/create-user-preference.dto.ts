import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserPreferenceDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  userId: string;

  @ApiPropertyOptional({ type: [String], example: ['Sports', 'Reading'] })
  @IsOptional()
  @IsArray()
  hobbies?: string[];

  @ApiPropertyOptional({
    type: [String],
    example: ['Relationship', 'Friendship'],
  })
  @IsOptional()
  @IsArray()
  lookingFor?: string[];

  @ApiPropertyOptional({ type: [String], example: ['English', 'Vietnamese'] })
  @IsOptional()
  @IsArray()
  languages?: string[];

  @ApiPropertyOptional({ type: [String], example: ['Aries', 'Taurus'] })
  @IsOptional()
  @IsArray()
  zodiacSigns?: string[];

  @ApiPropertyOptional({ type: [String], example: ['Bachelors', 'Masters'] })
  @IsOptional()
  @IsArray()
  education?: string[];

  @ApiPropertyOptional({ type: [String], example: ['Want Kids', 'No Kids'] })
  @IsOptional()
  @IsArray()
  futureFamily?: string[];

  @ApiPropertyOptional({ type: [String], example: ['Introvert', 'Extrovert'] })
  @IsOptional()
  @IsArray()
  personalityTypes?: string[];

  @ApiPropertyOptional({ type: [String], example: ['Direct', 'Indirect'] })
  @IsOptional()
  @IsArray()
  communicationStyles?: string[];

  @ApiPropertyOptional({ type: [String], example: ['Dog', 'Cat'] })
  @IsOptional()
  @IsArray()
  petPreferences?: string[];

  @ApiPropertyOptional({ type: [String], example: ['Never', 'Occasionally'] })
  @IsOptional()
  @IsArray()
  drinking?: string[];

  @ApiPropertyOptional({ type: [String], example: ['Never', 'Occasionally'] })
  @IsOptional()
  @IsArray()
  smoking?: string[];

  @ApiPropertyOptional({ type: [String], example: ['Regularly', 'Sometimes'] })
  @IsOptional()
  @IsArray()
  exercise?: string[];

  @ApiPropertyOptional({ type: [String], example: ['Vegan', 'Omnivore'] })
  @IsOptional()
  @IsArray()
  diet?: string[];

  @ApiPropertyOptional({ type: [String], example: ['Instagram', 'Facebook'] })
  @IsOptional()
  @IsArray()
  socialMedia?: string[];

  @ApiPropertyOptional({ type: [String], example: ['Early Bird', 'Night Owl'] })
  @IsOptional()
  @IsArray()
  sleepHabits?: string[];
}
