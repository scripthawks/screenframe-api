import { TrimIsString } from '@app/core/decorators/validation';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsEmail,
  Length,
  Matches,
  ValidationArguments,
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

export class CreateUserInputDto {
  @IsNotEmpty()
  @Length(USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH, {
    message: (args: ValidationArguments) => {
      const value = args.value as string;
      if (value.length < USERNAME_MIN_LENGTH) {
        return `Minimum number of characters ${USERNAME_MIN_LENGTH}`;
      }
      if (value.length > USERNAME_MAX_LENGTH) {
        return `Maximum number of characters ${USERNAME_MAX_LENGTH}`;
      }
      return `Username must be between ${USERNAME_MIN_LENGTH} and ${USERNAME_MAX_LENGTH} characters`;
    },
  })
  @Matches(USERNAME_REGEX)
  @TrimIsString()
  @ApiProperty()
  userName: string;

  @IsNotEmpty()
  @IsEmail()
  @Matches(EMAIL_REGEX, {
    message: 'The email must match the format example@example.com ',
  })
  @TrimIsString()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @Length(PASS_MIN_LENGTH, PASS_MAX_LENGTH, {
    message: (args: ValidationArguments) => {
      const value = args.value as string;
      if (value.length < PASS_MIN_LENGTH) {
        return `Minimum number of characters ${PASS_MIN_LENGTH}`;
      }
      if (value.length > PASS_MAX_LENGTH) {
        return `Maximum number of characters ${PASS_MAX_LENGTH}`;
      }
      return `Username must be between ${PASS_MIN_LENGTH} and ${PASS_MAX_LENGTH} characters`;
    },
  })
  @Matches(PASSWORD_REGEX, {
    message: `Password must contain 0-9, a-z, A-Z, ! " # $ % & ' ( ) * + , - . / : ; < = > ? @ [ \\ ] ^ _ { | } ~`,
  })
  @TrimIsString()
  @ApiProperty()
  password: string;
}
