import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { ProfileViewDto } from '../user-accounts/users/api/view-dto/profile.view-dto';

export function ApiGetProfile() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get profile by user ID',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Profile has been successfully retrieved',
      type: ProfileViewDto,
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'User not found or deleted or Profile not found or deleted',
    }),
  );
}

export function ApiCreateProfile() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create a new profile',
    }),
    ApiBearerAuth('accessToken'),
    ApiConsumes('application/json'),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        required: ['firstName', 'lastName'],
        properties: {
          firstName: { type: 'string', example: 'John' },
          lastName: { type: 'string', example: 'Doe' },
          birthDate: { type: 'string', example: '1990-01-01' },
          country: { type: 'string', example: 'United States' },
          city: { type: 'string', example: 'New York' },
          about: { type: 'string', example: 'I am a software engineer' },
          userName: { type: 'string', example: 'johndoe' },
          avatar: {
            type: 'array',
            items: {
              type: 'file',
              format: 'binary',
              example: 'Need send avatar as a file',
            },
            description: 'Avatar image (JPEG, JPG, PNG) max 10MB',
            maxItems: 1,
            maxLength: 10 * 1024 * 1024,
          },
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Profile has been successfully created',
      type: ProfileViewDto,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Validation failed or Invalid file type or too large',
      content: {
        'application/json': {
          examples: {
            validationFailed: {
              summary: 'DTO validation failed',
              value: {
                timestamp: '2025-11-12T19:44:39.021Z',
                path: '/profile/update',
                message: 'Validation failed',
                extensions: [{ key: 'firstName', message: 'must be a string' }],
                code: 'BAD_REQUEST',
              },
            },
            invalidFileFormat: {
              summary: 'Invalid file format',
              value: {
                timestamp: '2025-11-12T19:44:39.021Z',
                path: '/profile/update',
                message: 'Invalid file size or format',
                extensions: [],
                code: 'BAD_REQUEST',
              },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized',
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Failed to save user or profile, try again later',
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Profile already created or user not found or deleted',
    }),
  );
}

export function ApiUpdateProfile() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update profile',
    }),
    ApiBearerAuth('accessToken'),
    ApiConsumes('application/json'),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          firstName: { type: 'string', example: 'John' },
          lastName: { type: 'string', example: 'Doe' },
          birthDate: { type: 'string', example: '1990-01-01' },
          country: { type: 'string', example: 'United States' },
          city: { type: 'string', example: 'New York' },
          about: { type: 'string', example: 'I am a software engineer' },
          userName: { type: 'string', example: 'johndoe' },
          avatar: {
            type: 'array',
            items: {
              type: 'file',
              format: 'binary',
              example: 'Need send avatar as a file',
            },
            description: 'Avatar image (JPEG, JPG, PNG) max 10MB',
            maxItems: 1,
            maxLength: 10 * 1024 * 1024,
          },
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Profile has been successfully updated',
      type: ProfileViewDto,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Validation failed or Invalid file type or too large',
      content: {
        'application/json': {
          examples: {
            validationFailed: {
              summary: 'DTO validation failed',
              value: {
                timestamp: '2025-11-12T19:44:39.021Z',
                path: '/profile/update',
                message: 'Validation failed',
                extensions: [{ key: 'firstName', message: 'must be a string' }],
                code: 'BAD_REQUEST',
              },
            },
            invalidFileFormat: {
              summary: 'Invalid file format',
              value: {
                timestamp: '2025-11-12T19:44:39.021Z',
                path: '/profile/update',
                message: 'Invalid file size or format',
                extensions: [],
                code: 'BAD_REQUEST',
              },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized',
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Failed to save user or profile, try again later',
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description:
        'User not found or deleted, no data to update or should create profile first',
    }),
  );
}
