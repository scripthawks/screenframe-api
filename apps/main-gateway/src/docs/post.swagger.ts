import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { ApiFieldErrorDto } from '@app/core/decorators/swagger/dtos';
import { PostViewDto } from '../posts/api/view-dto/post.view-dto';
import { BasePaginatedViewDto } from '@app/core/dtos';
import { MainPagePostsViewDto } from '../posts/api/view-dto/main.view-dto';
import { ApiProperty } from '@nestjs/swagger';

export function ApiCreatePost() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create a new post',
    }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'The post has been successfully created',
      type: PostViewDto,
    }),
    // ApiConsumes('description - application/json, images - multipart/form-data'),
    ApiConsumes('application/json'),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        required: ['description', 'images'],
        properties: {
          description: {
            type: 'string',
            example: 'My post description',
          },
          images: {
            type: 'array',
            items: {
              type: 'string',
              format: 'binary',
            },
            description: 'Images (JPEG, JPG, PNG)',
          },
        },
      },
    }),
    ApiBearerAuth('accessToken'),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description:
        'Invalid request (validation failed or user not found or deleted or invalid file type).',
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
                path: '/posts/create',
                message: 'Validation failed',
                extensions: [
                  { key: 'description', message: 'must be a string' },
                ],
                code: 'BAD_REQUEST',
              },
            },
            userNotFound: {
              summary: 'Is user exists',
              value: {
                timestamp: '2025-11-12T19:44:39.021Z',
                path: '/posts/create',
                message: 'User not found or deleted',
                extensions: [],
                code: 'BAD_REQUEST',
              },
            },
            invalidFileType: {
              summary: 'Invalid file type',
              value: {
                timestamp: '2025-11-12T19:44:39.021Z',
                path: '/posts/create',
                message: 'Invalid file type',
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
      description: 'Token is invalid or expired',
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: 'User is not allowed to create a post',
    }),
  );
}

export function ApiUpdatePost() {
  return applyDecorators(
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'The post has been successfully updated',
      type: PostViewDto,
    }),
    ApiOperation({
      summary: 'Update a post',
    }),
    ApiBearerAuth('accessToken'),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Invalid request (validation failed).',
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
                path: '/posts/update',
                message: 'Validation failed',
              },
            },
            postNotFound: {
              summary: 'Post not found or deleted',
              value: {
                timestamp: '2025-11-12T19:44:39.021Z',
                path: '/posts/update',
                message: 'Post not found or deleted',
              },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Token is invalid or expired',
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: 'User is not allowed to update a post',
    }),
  );
}

export function ApiDeletePost() {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete a post',
    }),
    ApiBearerAuth('accessToken'),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'The post has been successfully deleted',
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Post not found or deleted',
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Token is invalid or expired',
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: 'User is not allowed to delete a post',
    }),
  );
}

export function ApiGetPostsByUserId() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get posts by user ID',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Posts have been successfully retrieved',
      type: PaginatedPostsViewDto,
    }),
  );
}

export function ApiGetMainPagePosts() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get main page posts',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Posts have been successfully retrieved',
      type: MainPagePostsViewDto,
    }),
  );
}

export function ApiGetPostById() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get post by ID',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Post has been successfully retrieved',
      type: PostViewDto,
    }),
  );
}

class PaginatedPostsViewDto extends BasePaginatedViewDto<PostViewDto[]> {
  @ApiProperty({ type: [PostViewDto] })
  items: PostViewDto[];
}
