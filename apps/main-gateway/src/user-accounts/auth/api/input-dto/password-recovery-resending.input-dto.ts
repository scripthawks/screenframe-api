import { IsValidEmail } from '../../../core/decorators/validation/is-valid-email';
import { ApiProperty } from '@nestjs/swagger';
import { EMAIL_REGEX } from '../../../core/constants/dto.constants';

export class PasswordRecoveryResendingInputDto {
  @IsValidEmail()
  @ApiProperty({
    pattern: `${EMAIL_REGEX}`,
    example: 'example@example.com',
    description: 'User email for password recovery resending',
  })
  email: string;
}
