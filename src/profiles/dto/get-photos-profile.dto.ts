import { IsArray, IsString, ArrayNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetProfilePhotosDto {
  @ApiProperty({
    description: 'Danh sách các file ID',
    type: [String],
    example: ['123', '456', '789'],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  fileIds: string[];
}
