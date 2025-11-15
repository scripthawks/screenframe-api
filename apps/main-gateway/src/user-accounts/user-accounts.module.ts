import { Module } from '@nestjs/common';
import { UsersController } from './users/api/users.controller';
import { PostsController } from '../posts/api/posts.controller';
import { UsersService } from './users/application/users.service';
import { PostsService } from '../posts/application/posts.service';
import { UsersRepository } from './users/infrastructure/users.repository';
import { UsersQueryRepository } from './users/infrastructure/users.query-repository';
import { PostsRepository } from '../posts/infrastructure/posts.repository';
import { PostsQueryRepository } from '../posts/infrastructure/posts.query-repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/domain/user.entity';
import { UserAccountConfig } from './core/config/user-account.config';

const configs = [UserAccountConfig];
const strategies = [];
const controllers = [UsersController, PostsController];
const services = [UsersService, PostsService];
const useCases = [];
const queries = [];
const repositories = [
  UsersRepository,
  UsersQueryRepository,
  PostsRepository,
  PostsQueryRepository,
];

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [...controllers],
  providers: [...configs, ...services, ...repositories],
})
export class UserAccountsModule {}
