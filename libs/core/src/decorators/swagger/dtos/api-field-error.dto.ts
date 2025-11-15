import { ApiProperty } from '@nestjs/swagger';

export class ApiFieldErrorDto {
  @ApiProperty({
    type: String,
    description: 'Timestamp when error occurred',
    example: '2025-11-12T19:44:39.021Z',
  })
  timestamp: string;

  @ApiProperty({
    type: String,
    description: 'API path where error occurred',
    example: 'string',
  })
  path: string;

  @ApiProperty({
    type: String,
    description: 'Main error message',
    example: 'string',
  })
  message: string;

  @ApiProperty({
    type: [String],
    description: 'Additional error extensions',
    example: [],
  })
  extensions: string[];

  @ApiProperty({
    type: String,
    description: 'Error code',
    example: 'string',
  })
  code: string;
}
