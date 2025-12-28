import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

interface AuthRequest extends Request {
  user: { sessionId: string };
}

/**
 * Decorator for retrieving the session ID of the currently authenticated user.
 *
 * This decorator extracts the session ID from the refresh token JWT payload,
 * which is added to the request object (`request.user`) after successful
 * authentication via `RefreshTokenGuard`. The session ID corresponds to a
 * unique device/session identifier stored in the database.
 *
 * **Important:** For the decorator to work correctly, you must:
 * 1. Apply `RefreshTokenGuard` to the endpoint or controller
 * 2. Configure the RefreshToken strategy to include `sessionId` (or `deviceId`)
 *    in the JWT payload and add it to `request.user`
 * 3. Ensure the session exists and is active in the database
 *
 * @example Logout usage:
 * ```typescript
 * @Controller('auth')
 * export class AuthController {
 *   @Post('logout')
 *   @UseGuards(RefreshTokenGuard)
 *   async logout(
 *     @CurrentSessionId() sessionId: string,
 *     @Res() response: Response
 *   ) {
 *     // sessionId will be extracted from the refresh token
 *     await this.sessionService.deactivateSession(sessionId);
 *     response.clearCookie('refreshToken');
 *   }
 * }
 * ```
 *
 * @example Device management usage:
 * ```typescript
 * @Controller('sessions')
 * @UseGuards(RefreshTokenGuard)
 * export class SessionsController {
 *   @Delete(':sessionId')
 *   async terminateSession(
 *     @Param('sessionId') targetSessionId: string,
 *     @CurrentSessionId() currentSessionId: string
 *   ) {
 *     // Can compare current session with target session
 *     return this.sessionService.terminateSession(targetSessionId);
 *   }
 * }
 * ```
 *
 * @returns {string} The session/device ID of the current authentication session
 *
 * @throws {UnauthorizedException} - If the user is not authenticated or if
 * the `sessionId` is not found in the request object. This occurs when:
 * - No refresh token is provided in the HTTP-only cookie
 * - The refresh token has expired or is invalid
 * - The refresh token payload doesn't contain a session ID
 * - The endpoint is not protected by `RefreshTokenGuard`
 *
 * @note The session ID is typically generated during login and corresponds to
 * a specific device/browser session. It's used to:
 * - Track multiple simultaneous logins from different devices
 * - Allow users to manage their active sessions
 * - Enable device-specific logout
 * - Implement refresh token rotation security
 *
 * @see {@link RefreshTokenGuard}
 * @see {@link RefreshTokenStrategy}
 * @see {@link LoginUserCommand}
 * @see {@link https://auth0.com/docs/secure/tokens/refresh-tokens | Refresh Token Security}
 */

export const CurrentSessionId = createParamDecorator(
  (data: unknown, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    if (!request.user.sessionId) {
      throw new UnauthorizedException(
        `Session id ${request.user.sessionId} not found`,
      );
    }
    return request.user.sessionId;
  },
);
