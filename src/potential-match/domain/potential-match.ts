import { ApiProperty } from '@nestjs/swagger';

export class PotentialMatch {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  userId: string;

  @ApiProperty({ type: String })
  potentialMatchId: string;

  @ApiProperty({ type: Number, example: 85.5 })
  matchScore: number;

  @ApiProperty()
  createdAt: Date;

  static fromDto(data: Partial<PotentialMatch>): PotentialMatch {
    const instance = new PotentialMatch();
    Object.assign(instance, data);
    return instance;
  }
}
