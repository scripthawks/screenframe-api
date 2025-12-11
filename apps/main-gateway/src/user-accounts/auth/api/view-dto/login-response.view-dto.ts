import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseViewDto {
  @ApiProperty({
    description: 'JWT access token for API authorization',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }
}
