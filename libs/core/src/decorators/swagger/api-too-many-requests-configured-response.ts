import { applyDecorators } from '@nestjs/common';
import { ApiTooManyRequestsResponse } from '@nestjs/swagger';

/**
 * Decorator for specifying a 429 Too Many Requests response with an optional description.
 *
 * This decorator configures the API response to indicate that the user has sent too many requests
 * in a given amount of time ("rate limiting"). This is used to prevent abuse and ensure fair usage
 * of the API resources. It allows for a custom description to be provided, with a default value
 * of 'Too Many Requests'.
 *
 * @param description - Description of the response ('Too Many Requests' by default).
 *
 * @publicApi
 */

export function ApiTooManyRequestsConfiguredResponse(
  description: string = 'Too Many Requests',
) {
  return applyDecorators(ApiTooManyRequestsResponse({ description }));
}
