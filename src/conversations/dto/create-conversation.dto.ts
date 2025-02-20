import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/domain/user';

export class CreateConversationDto {
  @ApiProperty({
    type: String,
  })
  user1Id: User['id'];

  @ApiProperty({
    type: String,
  })
  user2Id: User['id'];
}
