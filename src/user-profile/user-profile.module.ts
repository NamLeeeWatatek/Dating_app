import { Module } from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { ProfileModule } from '../profiles/profiles.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule, ProfileModule],
  providers: [UserProfileService],
  exports: [UserProfileService],
})
export class UserProfileModule {}
