import { IsEmail, IsNotEmpty, Matches } from 'class-validator';
import { TrimIsString } from '@app/core/decorators/validation';
import { ApiProperty } from '@nestjs/swagger';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export class ResendVerificationInputDto {
  @TrimIsString()
  @IsNotEmpty()
  @IsEmail()
  @Matches(EMAIL_REGEX, {
    message: 'email should follow the pattern: example@example.com',
  })
  @ApiProperty({
    pattern: `${EMAIL_REGEX}`,
    example: 'example@example.com',
    description: 'Email of already registered but not confirmed user',
  })
  email: string;
}
