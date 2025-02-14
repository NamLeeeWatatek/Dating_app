import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateUserPreferenceDto } from './create-user-preference.dto';

import { IsOptional } from 'class-validator';

export class UpdateUserPreferenceDto extends PartialType(
  CreateUserPreferenceDto,
) {
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  userId?: string;
}
