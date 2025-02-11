import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ example: 400, description: 'HTTP status code' })
  statusCode: number;

  @ApiProperty({
    example: 'Bad Request',
    description: 'Short error message',
  })
  message: string;

  @ApiProperty({
    example: { fieldName: 'errorDescription' },
    description: 'Detailed error messages mapped by field',
    required: false,
  })
  errors?: string;

  constructor(statusCode: number, message: string, errors?: string) {
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
  }
}
