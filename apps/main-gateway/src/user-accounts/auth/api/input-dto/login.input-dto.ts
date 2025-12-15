import { TrimIsString } from '@app/core/decorators/validation';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';
import {
  EMAIL_REGEX,
  PASS_MAX_LENGTH,
  PASS_MIN_LENGTH,
  PASSWORD_REGEX,
} from '../../../core/constants/dto.constants';

export class LoginInputDto {
  @IsNotEmpty()
  @TrimIsString()
  @IsEmail()
  @Matches(EMAIL_REGEX)
  @ApiProperty({
    pattern: `${EMAIL_REGEX}`,
    example: 'example@example.com',
    description: 'Email address for authentication',
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
    description: 'Password for authentication',
  })
  password: string;
}
