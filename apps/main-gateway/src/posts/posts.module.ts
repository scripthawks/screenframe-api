import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsController } from './api/posts.controller';
import { CreatePostUseCase } from './application/use-case/create-post.use-case';
import { Post } from './domain/post.entity';
import { PostImage } from './domain/post-image.entity';
import { PostsRepository } from './infrastructure/posts.repository';
import { PostsQueryRepository } from './infrastructure/posts.query-repository';
import { User } from '../user-accounts/users/domain/user.entity';
import { UsersRepository } from '../user-accounts/users/infrastructure/users.repository';
import { PostsService } from './application/posts.service';
import { FilesClientModule } from '../clients/files/files-client.module';
import { UserAccountsModule } from '../user-accounts/user-accounts.module';
import { UpdatePostUseCase } from './application/use-case/update-post.use-case';
import { DeletePostUseCase } from './application/use-case/delete-post.use-case';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([Post, PostImage, User]),
    MulterModule.register(),
    FilesClientModule,
    UserAccountsModule,
  ],
  controllers: [PostsController],
  providers: [
    PostsRepository,
    PostsQueryRepository,
    UsersRepository,
    CreatePostUseCase,
    UpdatePostUseCase,
    DeletePostUseCase,
    PostsService,
  ],
  exports: [TypeOrmModule],
})
export class PostsModule {}
