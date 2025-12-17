import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

interface AuthRequest extends Request {
  user: { userId: string };
}

/**
 * Decorator for retrieving the ID of the currently authenticated user.
 *
 * This decorator extracts the user ID from the JWT token, which is added to the
 * request object (`request.user`) after successful authentication via `JwtAuthGuard`.
 *
 * **Important:** For the decorator to work correctly, you must:
 * 1. Apply `JwtAuthGuard` to the endpoint or controller
 * 2. Configure the JWT strategy (`JwtStrategy`) to add `userId` to `request.user`
 *
 * @example Basic usage:
 * ```typescript
 * @Controller('users')
 * @UseGuards(JwtAuthGuard)
 * export class UsersController {
 *   @Get('profile')
 *   getProfile(@CurrentUserId() userId: string) {
 *     // userId will be extracted from the JWT token
 *     return this.service.getUserProfile(userId);
 *   }
 * }
 * ```
 *
 * @example Method-level usage:
 * ```typescript
 * @Controller('posts')
 * export class PostsController {
 *   @Post()
 *   @UseGuards(JwtAuthGuard)
 *   createPost(
 *     @Body() createPostDto: CreatePostDto,
 *     @CurrentUserId() authorId: string
 *   ) {
 *     return this.postsService.create(createPostDto, authorId);
 *   }
 * }
 * ```
 *
 * @returns {string} The ID of the currently authenticated user
 *
 * @throws {UnauthorizedException} - If the user is not authenticated
 * (the `request.user` object is missing). This occurs when:
 * - No JWT token is provided in the Authorization header
 * - The JWT token has expired or is invalid
 * - The endpoint is not protected by `JwtAuthGuard`
 *
 * @throws {InternalServerErrorException} - If `userId` is not found in the user object.
 * This indicates a configuration error where the JWT strategy is not properly
 * configured to add `userId` to `request.user`.
 *
 * @see {@link JwtAuthGuard}
 * @see {@link JwtStrategy}
 * @see {@link https://docs.nestjs.com/security/authentication#jwt-token | NestJS JWT Authentication}
 */

export const CurrentUserId = createParamDecorator(
  (data: unknown, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    return request.user.userId;
  },
);
