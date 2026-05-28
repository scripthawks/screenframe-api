import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
  Put,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { CreatePostDto } from '../domain/dto/create-post.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CurrentUserId } from '@app/core/decorators/params/current-user-id.decorator';
import { CreatePostCommand } from '../application/use-case/create-post.use-case';
import { CommandBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { PostsQueryRepository } from '../infrastructure/posts.query-repository';
import { PostViewDto } from './view-dto/post.view-dto';
import { UpdatePostDto } from '../domain/dto/update-post.dto';
import { UpdatePostCommand } from '../application/use-case/update-post.use-case';
import { DeletePostCommand } from '../application/use-case/delete-post.use-case';
import { GetPostsQueryParams } from './input-dto/get-posts-query-params';
import { BasePaginatedViewDto } from '@app/core/dtos';
import { MainPagePostsViewDto } from './view-dto/main.view-dto';
import { UsersQueryRepository } from '../../user-accounts/users/infrastructure/users.query-repository';
import {
  ApiCreatePost,
  ApiDeletePost,
  ApiGetPostsByUserId,
  ApiGetMainPagePosts,
  ApiGetPostById,
  ApiUpdatePost,
} from '../../docs/post.swagger';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FilesInterceptor('image', 10, {
      limits: { fileSize: 20 * 1024 * 1024, files: 10 },
    }),
  )
  @ApiCreatePost()
  async createPost(
    @CurrentUserId() userId: string,
    @Body() createPostDto: CreatePostDto,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<PostViewDto | null> {
    const postId: string = await this.commandBus.execute(
      new CreatePostCommand(createPostDto.description, userId, files),
    );

    return await this.postsQueryRepository.findOne(postId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiUpdatePost()
  async updatePost(
    @CurrentUserId() userId: string,
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostViewDto | null> {
    console.log(updatePostDto);
    const postId: string = await this.commandBus.execute(
      new UpdatePostCommand(id, updatePostDto.description, userId),
    );
    console.log(postId);
    return await this.postsQueryRepository.findOne(postId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiDeletePost()
  async deletePost(
    @CurrentUserId() userId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return await this.commandBus.execute(new DeletePostCommand(id, userId));
  }

  @Get('user/:userId')
  @ApiGetPostsByUserId()
  async findAll(
    @Param('userId') userId: string,
    @Query() query: GetPostsQueryParams,
  ): Promise<BasePaginatedViewDto<PostViewDto[]>> {
    return await this.postsQueryRepository.getAllPostsByUserId(userId, query);
  }

  @Get('main')
  @ApiGetMainPagePosts()
  async getMainPagePosts(): Promise<MainPagePostsViewDto> {
    const posts = await this.postsQueryRepository.getMainPagePosts();
    const totalUsersCount =
      await this.usersQueryRepository.getTotalUsersCount();
    return { posts, totalUsersCount };
  }

  @Get(':postId')
  @ApiGetPostById()
  async getPostById(
    @Param('postId') postId: string,
  ): Promise<PostViewDto | null> {
    return await this.postsQueryRepository.findOne(postId);
  }
}
