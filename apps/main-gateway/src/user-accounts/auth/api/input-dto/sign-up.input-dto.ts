import { TrimIsString } from '@app/core/decorators/validation';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsEmail,
  Length,
  Matches,
  IsBoolean,
} from 'class-validator';
import {
  EMAIL_REGEX,
  PASS_MAX_LENGTH,
  PASS_MIN_LENGTH,
  PASSWORD_REGEX,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_REGEX,
} from '../../../core/constants/dto.constants';

export class SignUpUserInputDto {
  @IsNotEmpty()
  @TrimIsString()
  @Length(USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH)
  @Matches(USERNAME_REGEX)
  @ApiProperty({
    minLength: USERNAME_MIN_LENGTH,
    maxLength: USERNAME_MAX_LENGTH,
    example: 'string',
    pattern: `${USERNAME_REGEX}`,
    description: 'Name for create/signup User',
  })
  userName: string;

  @IsNotEmpty()
  @TrimIsString()
  @IsEmail()
  @Matches(EMAIL_REGEX)
  @ApiProperty({
    pattern: `${EMAIL_REGEX}`,
    example: 'example@example.com',
    description: 'Email for create/signup User',
  })
  email: string;

  @IsNotEmpty()
  @TrimIsString()
  @Length(PASS_MIN_LENGTH, PASS_MAX_LENGTH)
  @Matches(PASSWORD_REGEX)
  @ApiProperty({
    minLength: PASS_MIN_LENGTH,
    maxLength: PASS_MAX_LENGTH,
    example: 'Str0ngP@ssw0rd!',
    pattern: `${PASSWORD_REGEX}`,
    description: 'Password for create/signup User',
  })
  password: string;

  @IsNotEmpty()
  @TrimIsString()
  @ApiProperty({
    minLength: PASS_MIN_LENGTH,
    maxLength: PASS_MAX_LENGTH,
    example: 'Str0ngP@ssw0rd!',
    pattern: `${PASSWORD_REGEX}`,
    description: 'Password confirmation must match the password',
  })
  passwordConfirmation: string;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    description: 'Required agreement to Terms of Service and Privacy Policy',
    example: true,
  })
  acceptedTerms: boolean;
}
