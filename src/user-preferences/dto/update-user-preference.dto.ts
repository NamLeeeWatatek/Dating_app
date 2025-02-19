import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateUserPreferenceDto } from './create-user-preference.dto';

export class UpdateUserPreferenceDto extends OmitType(
  PartialType(CreateUserPreferenceDto),
  ['userId'] as const,
) { }
