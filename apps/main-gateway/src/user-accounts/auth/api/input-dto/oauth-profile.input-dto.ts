import { TrimIsString } from '@app/core/decorators/validation';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class OAuthProfileDto {
  @ApiProperty({ description: 'Provider user ID from OAuth service' })
  id: string;

  @ApiProperty({
    required: false,
    description: 'Username from provider (e.g., GitHub username)',
  })
  username?: string;

  @ApiProperty({ required: false, description: 'Display name from provider' })
  displayName?: string;

  @TrimIsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    type: [Object],
    required: false,
    description: 'Email addresses from provider',
  })
  emails?: Array<{ value: string }>;
}
