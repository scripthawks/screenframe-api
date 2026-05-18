import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBody,
  ApiCookieAuth,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { ApiFieldErrorDto } from '@app/core/decorators/swagger/dtos';
import { SignUpUserInputDto } from 'apps/main-gateway/src/user-accounts/auth/api/input-dto/sign-up.input-dto';
import { LoginInputDto } from 'apps/main-gateway/src/user-accounts/auth/api/input-dto/login.input-dto';
import { ApiProperty } from '@nestjs/swagger';
import { MeViewDto } from 'apps/main-gateway/src/user-accounts/auth/api/view-dto/me.view-dto';
import { ApiBearerAuth } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({ example: 'accessToken' })
  accessToken: string;
}

export function ApiSigningUp() {
  return applyDecorators(
    ApiOperation({
      summary:
        'Sign up new user. Email confirmation required - verification link will be sent to the provided email.',
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description:
        'An email with a verification token has been sent to the specified email address',
    }),
    ApiResponse({
      status: HttpStatus.CONFLICT,
      description: 'User already exists',
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Invalid input data',
      type: ApiFieldErrorDto,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Passwords must match or are missing',
    }),
    ApiBody({ type: SignUpUserInputDto }),
    ApiResponse({
      status: HttpStatus.CONFLICT,
      description: 'User already exists by email or username',
    }),
    ApiResponse({
      status: HttpStatus.TOO_MANY_REQUESTS,
      description: 'Too many requests. Limit: 5 requests per 10 seconds',
    }),
  );
}

export function ApiVerifyEmail() {
  return applyDecorators(
    ApiOperation({ summary: 'Verify email' }),
    ApiExtraModels(ApiFieldErrorDto),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Email was verified. Account was activated',
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description:
        'Invalid request (validation failed or confirmation token is invalid/expired/used).',
      content: {
        'application/json': {
          schema: {
            oneOf: [{ $ref: getSchemaPath(ApiFieldErrorDto) }],
          },
          examples: {
            validationFailed: {
              summary: 'DTO validation failed',
              value: {
                timestamp: '2025-11-12T19:44:39.021Z',
                path: '/auth/verify-email',
                message: 'Validation failed',
                extensions: [
                  { key: 'confirmationToken', message: 'must be a string' },
                ],
                code: 'BAD_REQUEST',
              },
            },
            invalidTokenNotFound: {
              summary: 'Token not found',
              value: {
                timestamp: '2025-11-12T19:44:39.021Z',
                path: '/auth/verify-email',
                message: 'Invalid confirmation token',
                extensions: [],
                code: 'BAD_REQUEST',
              },
            },
            tokenExpired: {
              summary: 'Token expired',
              value: {
                timestamp: '2025-11-12T19:44:39.021Z',
                path: '/auth/verify-email',
                message: 'Confirmation token expired',
                extensions: [],
                code: 'BAD_REQUEST',
              },
            },
            tokenAlreadyUsed: {
              summary: 'Token already used',
              value: {
                timestamp: '2025-11-12T19:44:39.021Z',
                path: '/auth/verify-email',
                message: 'Confirmation token already used',
                extensions: [],
                code: 'BAD_REQUEST',
              },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.CONFLICT,
      description: 'Email already confirmed',
    }),
  );
}

export function ApiResendVerification() {
  return applyDecorators(
    ApiOperation({ summary: 'Resend verification if the user exists' }),
    ApiExtraModels(ApiFieldErrorDto),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description:
        'An email with a verification token has been sent to the specified email address',
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Invalid input data or email is invalid',
      type: ApiFieldErrorDto,
    }),
    ApiResponse({
      status: HttpStatus.CONFLICT,
      description: 'Email already confirmed',
    }),
  );
}

export function ApiLogin() {
  return applyDecorators(
    ApiOperation({
      summary:
        'Authenticates user with email and password. Returns access token and sets refresh token in HTTP-only cookie.',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Login successful',
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Invalid email format or password requirements not met.',
      type: ApiFieldErrorDto,
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Email not verified or account is disabled.',
    }),
    ApiBody({ type: LoginInputDto }),
    ApiResponse({
      status: HttpStatus.TOO_MANY_REQUESTS,
      description: 'Too many requests. Limit: 5 requests per 10 seconds',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'OK',
      type: LoginResponseDto,
      headers: {
        'Set-Cookie': {
          description: 'Refresh token',
          schema: {
            type: 'string',
            format: 'cookie',
            example: 'refreshToken=1234567890; HttpOnly; Secure; SameSite=None',
          },
        },
      },
    }),
  );
}

export function ApiRefreshToken() {
  return applyDecorators(
    ApiOperation({
      summary:
        'Refresh access token. Issues new access and refresh tokens using valid refresh token from HTTP-only cookie. Invalidates previous refresh token.',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Refresh token successful',
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Invalid refresh token format or missing cookie',
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Invalid input data',
      type: ApiFieldErrorDto,
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Invalid, expired or revoked refresh token',
    }),
    ApiResponse({
      status: HttpStatus.TOO_MANY_REQUESTS,
      description: 'Too many requests. Limit: 5 requests per 10 seconds',
    }),
    ApiCookieAuth('refreshToken'),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'OK',
      type: LoginResponseDto,
      headers: {
        'Set-Cookie': {
          description: 'Refresh token',
          schema: {
            type: 'string',
            format: 'cookie',
            example: 'refreshToken=1234567890; HttpOnly; Secure; SameSite=None',
          },
        },
      },
    }),
  );
}

export function ApiLogout() {
  return applyDecorators(
    ApiOperation({ summary: 'Logout user and terminate current session' }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Successfully logged out.',
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description:
        'Invalid, expired or missing refresh token. User not authenticated.',
    }),
    ApiCookieAuth('refreshToken'),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Successfully logged out.',
    }),
  );
}

export function ApiGetMe() {
  return applyDecorators(
    ApiOperation({
      summary:
        'Returns detailed information about the currently authenticated user. Requires valid JWT token.',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'OK',
      type: MeViewDto,
    }),
    ApiBearerAuth('accessToken'),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description:
        'Invalid, expired or missing access token. User not authenticated.',
    }),
  );
}

export function ApiPasswordRecovery() {
  return applyDecorators(
    ApiOperation({
      summary:
        'Password recovery. Email with confirmation code will be send to passed email address',
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description:
        'Password recovery link has been sent to the specified email',
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Invalid email or reCAPTCHA verification failed',
      type: ApiFieldErrorDto,
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: 'Email not verified',
    }),
    ApiResponse({
      status: HttpStatus.TOO_MANY_REQUESTS,
      description: 'Too many attempts. Please repeat later',
    }),
  );
}

export function ApiCheckRecoveryToken() {
  return applyDecorators(
    ApiOperation({ summary: 'Check recovery token' }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Recovery token is valid',
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Invalid or expired recovery token',
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Invalid input data',
      type: ApiFieldErrorDto,
    }),
    ApiResponse({
      status: HttpStatus.TOO_MANY_REQUESTS,
      description: 'Too many attempts. Please repeat later',
    }),
  );
}

export function ApiPasswordRecoveryResending() {
  return applyDecorators(
    ApiOperation({
      summary:
        'Resend password recovery link. Email with confirmation code will be send to passed email address',
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description:
        'Password recovery link has been sent to the specified email',
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Invalid email',
      type: ApiFieldErrorDto,
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: 'Email not verified',
    }),
    ApiResponse({
      status: HttpStatus.TOO_MANY_REQUESTS,
      description: 'Too many attempts. Please repeat later',
    }),
  );
}

export function ApiNewPassword() {
  return applyDecorators(
    ApiOperation({
      summary: 'Set new password, deactivates all user sessions',
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Password successfully changed',
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description:
        'Invalid or expired recovery token or passwords do not match',
      type: ApiFieldErrorDto,
    }),
    ApiResponse({
      status: HttpStatus.TOO_MANY_REQUESTS,
      description: 'Too many attempts. Please repeat later',
    }),
  );
}
