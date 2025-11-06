import { Module } from '@nestjs/common';
import { UsersController } from './users/api/users.controller';
import { UsersService } from './users/application/users.service';
import { PostsController } from './posts/api/posts.controller';
import { PostsService } from './posts/application/posts.service';
import { CoreModule } from '@app/core';
import { UsersRepository } from './users/infrastructure/users.repository';
import { UsersQueryRepository } from './users/infrastructure/users.query-repository';
import { PostsRepository } from './posts/infrastructure/posts.repository';
import { PostsQueryRepository } from './posts/infrastructure/posts.query-repository';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from './users/domain/user.entity';
import { typeormOptions } from './core/db/typeorm/typeorm-options';

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
  imports: [
    CoreModule,
    TypeOrmModule.forRootAsync({
      useFactory: (): TypeOrmModuleOptions => {
        return {
          ...typeormOptions,
          autoLoadEntities: true,
        };
      },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [...controllers],
  providers: [...services, ...repositories],
})
export class MainModule {}
