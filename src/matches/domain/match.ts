import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class Match {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  @Expose()
  userId: string;

  @ApiProperty({ type: String })
  @Expose()
  matchedUserId: string;

  @ApiProperty()
  matchedAt: Date;

  constructor(
    id: string,
    userId: string,
    matchedUserId: string,
    matchedAt: Date,
  ) {
    this.id = id;
    this.userId = userId;
    this.matchedUserId = matchedUserId;
    this.matchedAt = matchedAt;
  }

  static create(userId: string, matchedUserId: string): Match {
    return new Match(crypto.randomUUID(), userId, matchedUserId, new Date());
  }
}
