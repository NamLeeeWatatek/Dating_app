import { Injectable } from '@nestjs/common';
import { UserProfileDto } from './dto/user-profile.dto';
import { UsersService } from '../users/users.service';
import { ProfileService } from '../profiles/proifiles.service';

@Injectable()
export class UserProfileService {
  constructor(
    private readonly userService: UsersService,
    private readonly profileService: ProfileService,
  ) {}

  async getUserWithProfile(userId: string): Promise<UserProfileDto | null> {
    const user = await this.userService.findById(userId);
    if (!user) return null;

    const profile = await this.profileService.findByUserId(userId);
    if (!profile) return null;

    const userProfile = new UserProfileDto();
    userProfile.id = user?.id;
    userProfile.age = profile?.age;
    userProfile.displayName = profile?.displayName;
    userProfile.image = profile.files?.[0] ?? null;

    return userProfile;
  }
}
