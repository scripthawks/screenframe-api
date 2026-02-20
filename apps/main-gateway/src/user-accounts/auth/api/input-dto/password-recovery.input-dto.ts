import { TrimIsString } from '@app/core/decorators/validation';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EMAIL_REGEX } from '../../../core/constants/dto.constants';
import { IsValidEmail } from '../../../core/decorators/validation/is-valid-email';

export class PasswordRecoveryInputDto {
  @IsValidEmail()
  @ApiProperty({
    pattern: `${EMAIL_REGEX}`,
    example: 'example@example.com',
    description: 'User email for password recovery',
  })
  email: string;

  @TrimIsString()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Google reCAPTCHA token' })
  recaptchaToken: string;
}
