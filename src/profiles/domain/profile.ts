import { User } from '../../users/domain/user';
import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '../../utils/enums/gender';

export class Profile {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: () => User })
  user: User;

  @ApiProperty({ type: String, example: 'John Doe' })
  displayName: string;

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
  updatedAt: Date;
}
