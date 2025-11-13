import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';
import { ApiErrorResultDto, ApiFieldErrorDto } from './dtos';

/**
 * Decorator for configuring API responses with a 400 (Bad Request) status code.
 *
 * This decorator applies the necessary metadata for documenting the API response
 * when the input model contains invalid values. It utilizes the `ApiExtraModels`
 * decorator to include the `ApiErrorResult` and `FieldError` models in the Swagger
 * documentation, ensuring that the response schema is properly referenced.
 *
 * @param description - A custom description for the error response. Defaults to
 * 'If the inputModel has incorrect values.'
 *
 * @publicApi
 */

export function ApiBadRequestConfiguredResponse(
  description: string = 'If the inputModel has incorrect values.',
) {
  return applyDecorators(
    ApiExtraModels(ApiErrorResultDto, ApiFieldErrorDto),
    ApiBadRequestResponse({
      description,
      schema: {
        $ref: getSchemaPath(ApiErrorResultDto),
      },
    }),
  );
}
