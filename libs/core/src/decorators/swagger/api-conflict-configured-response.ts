import { applyDecorators } from '@nestjs/common';
import { ApiConflictResponse } from '@nestjs/swagger';

/**
 * Decorator for specifying a 409 Conflict response with an optional description.
 *
 * This decorator configures the API response to indicate that the request could not be completed
 * due to a conflict with the current state of the target resource. This typically occurs when
 * attempting to create or update a resource that would result in a duplicate or inconsistent state.
 * It allows for a custom description to be provided, with a default value of 'Conflict'.
 *
 * @param description - Description of the response ('Conflict' by default).
 *
 * @publicApi
 */

export function ApiConflictConfiguredResponse(
  description: string = 'Conflict',
) {
  return applyDecorators(ApiConflictResponse({ description }));
}
