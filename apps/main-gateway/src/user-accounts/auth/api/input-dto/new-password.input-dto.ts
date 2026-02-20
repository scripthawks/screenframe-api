import { TrimIsString } from '@app/core/decorators/validation';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length, Matches, IsUUID } from 'class-validator';
import {
  PASS_MAX_LENGTH,
  PASS_MIN_LENGTH,
  PASSWORD_REGEX,
} from '../../../core/constants/dto.constants';

export class NewPasswordInputDto {
  @TrimIsString()
  @IsNotEmpty()
  @Length(PASS_MIN_LENGTH, PASS_MAX_LENGTH)
  @Matches(PASSWORD_REGEX)
  @ApiProperty({
    minLength: PASS_MIN_LENGTH,
    maxLength: PASS_MAX_LENGTH,
    example: 'Str0ngP@ssw0rd!',
    pattern: `${PASSWORD_REGEX}`,
    description: 'New password',
  })
  password: string;

  @TrimIsString()
  @IsNotEmpty()
  @ApiProperty({
    minLength: PASS_MIN_LENGTH,
    maxLength: PASS_MAX_LENGTH,
    example: 'Str0ngP@ssw0rd!',
    pattern: `${PASSWORD_REGEX}`,
    description:
      'Confirmation of the new password; must match the password field',
  })
  passwordConfirmation: string;

  @TrimIsString()
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({ description: 'The recovery token used for password recovery' })
  recoveryToken: string;
}
