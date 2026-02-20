import { applyDecorators } from '@nestjs/common';
import { TrimIsString } from '@app/core/decorators/validation';
import { IsEmail, IsNotEmpty, Matches } from 'class-validator';
import { EMAIL_REGEX } from '../../constants/dto.constants';

export const IsValidEmail = () =>
  applyDecorators(
    TrimIsString(),
    IsNotEmpty(),
    IsEmail(),
    Matches(EMAIL_REGEX, {
      message: 'Email should follow the pattern: example@example.com',
    }),
  );
