import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserPreference {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  @Expose({ groups: ['me', 'admin'] })
  userId: string;

  @ApiProperty({ type: [String], example: ['Sports', 'Reading'] })
  @Expose({ groups: ['me', 'admin'] })
  hobbies: string[];

  @ApiProperty({ type: [String], example: ['Relationship', 'Friendship'] })
  @Expose({ groups: ['me', 'admin'] })
  lookingFor: string[];

  @ApiProperty({ type: [String], example: ['English', 'Vietnamese'] })
  @Expose({ groups: ['me', 'admin'] })
  languages: string[];

  @ApiProperty({ type: [String], example: ['Aries', 'Taurus'] })
  @Expose({ groups: ['me', 'admin'] })
  zodiacSigns: string[];

  @ApiProperty({ type: [String], example: ['Bachelors', 'Masters'] })
  @Expose({ groups: ['me', 'admin'] })
  education: string[];

  @ApiProperty({ type: [String], example: ['Want Kids', 'No Kids'] })
  @Expose({ groups: ['me', 'admin'] })
  futureFamily: string[];

  @ApiProperty({ type: [String], example: ['Introvert', 'Extrovert'] })
  @Expose({ groups: ['me', 'admin'] })
  personalityTypes: string[];

  @ApiProperty({ type: [String], example: ['Direct', 'Indirect'] })
  @Expose({ groups: ['me', 'admin'] })
  communicationStyles: string[];

  @ApiProperty({ type: [String], example: ['Dog', 'Cat'] })
  @Expose({ groups: ['me', 'admin'] })
  petPreferences: string[];

  @ApiProperty({ type: [String], example: ['Never', 'Occasionally'] })
  @Expose({ groups: ['me', 'admin'] })
  drinking: string[];

  @ApiProperty({ type: [String], example: ['Never', 'Occasionally'] })
  @Expose({ groups: ['me', 'admin'] })
  smoking: string[];

  @ApiProperty({ type: [String], example: ['Regularly', 'Sometimes'] })
  @Expose({ groups: ['me', 'admin'] })
  exercise: string[];

  @ApiProperty({ type: [String], example: ['Vegan', 'Omnivore'] })
  @Expose({ groups: ['me', 'admin'] })
  diet: string[];

  @ApiProperty({ type: [String], example: ['Instagram', 'Facebook'] })
  @Expose({ groups: ['me', 'admin'] })
  socialMedia: string[];

  @ApiProperty({ type: [String], example: ['Early Bird', 'Night Owl'] })
  @Expose({ groups: ['me', 'admin'] })
  sleepHabits: string[];
}
