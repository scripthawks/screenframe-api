import { TrimIsString } from '@app/core/decorators/validation';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, Length, Matches } from 'class-validator';
import {
  EMAIL_REGEX,
  PASS_MAX_LENGTH,
  PASS_MIN_LENGTH,
  PASSWORD_REGEX,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_REGEX,
} from '../../../core/constants/dto.constants';

export class CreateUserInputDto {
  @IsNotEmpty()
  @Length(USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH)
  @Matches(USERNAME_REGEX)
  @TrimIsString()
  @ApiProperty()
  userName: string;

  @IsNotEmpty()
  @IsEmail()
  @Matches(EMAIL_REGEX)
  @TrimIsString()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @Length(PASS_MIN_LENGTH, PASS_MAX_LENGTH)
  @Matches(PASSWORD_REGEX)
  @TrimIsString()
  @ApiProperty()
  password: string;
}
