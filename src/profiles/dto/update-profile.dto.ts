import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateProfileDto } from './create-profile.dto';

export class UpdateProfileDto extends OmitType(
  PartialType(CreateProfileDto),
  ['userId'] as const, // Loại bỏ userId
) { }
