import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { DomainException } from '../exceptions';
import { CommonExceptionCodes } from '../exceptions/enums';

const formatValidationErrors = (
  errors: ValidationError[],
  result: { key: string; message: string }[] = [],
): { key: string; message: string }[] => {
  for (const error of errors) {
    if (!error.constraints && error.children?.length) {
      formatValidationErrors(error.children, result);
    } else if (error.constraints) {
      for (const message of Object.values(error.constraints)) {
        result.push({ key: error.property, message });
      }
    }
  }
  return result;
};

export function pipesSetup(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      stopAtFirstError: true,
      exceptionFactory: (errors) =>
        new DomainException(
          CommonExceptionCodes.BAD_REQUEST,
          'Validation failed',
          formatValidationErrors(errors),
        ),
    }),
  );
}
