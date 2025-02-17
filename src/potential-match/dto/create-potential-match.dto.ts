import { ApiProperty } from '@nestjs/swagger';

export class CreatePotentialMatchDto {
  @ApiProperty({
    type: String,
    description: 'Unique identifier of the potential match',
  })
  id: string;

  @ApiProperty({
    type: String,
    description: 'User ID who is looking for a match',
  })
  userId: string;

  @ApiProperty({ type: String, description: 'Potential match user ID' })
  potentialMatchId: string;

  @ApiProperty({ type: Number, description: 'Match score between the users' })
  matchScore: number;
}
