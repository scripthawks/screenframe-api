import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from '../application/posts.service';
import { CreatePostDto } from '../domain/dto/create-post.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CurrentUserId } from '@app/core/decorators/params/current-user-id.decorator';
import { CreatePostCommand } from '../application/use-case/create-post.use-case';
import { CommandBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { PostsQueryRepository } from '../infrastructure/posts.query-repository';
import { PostViewDto } from './view-dto/post.view-dto';
import * as multer from 'multer';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly commandBus: CommandBus,
    private readonly postsQueryRepository: PostsQueryRepository,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FilesInterceptor('image', 10, {
      storage: multer.memoryStorage(),
      limits: { fileSize: 20 * 1024 * 1024, files: 10 },
    }),
  )
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

  @Get()
  findAll() {
    return this.postsService.findAll();
  }
}
