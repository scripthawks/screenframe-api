import { Response } from 'supertest';

/**
 * Validates HTTP response status with automatic error logging.
 * Performs status validation and logs the complete response body to console
 * when the actual status differs from expected.
 *
 * @param response - supertest response object to validate
 * @param expectedStatus - HTTP status code expected from the API
 */

export function expectWithErrorLog(
  response: Response,
  expectedStatus: number,
): void {
  if (response.status !== expectedStatus) {
    console.log('Error response:', JSON.stringify(response.body, null, 2));
  }
  expect(response.status).toBe(expectedStatus);
}
