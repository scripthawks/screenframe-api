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
import { EmailConfirmation } from './users/domain/emailConfirmation.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { UuidProvider } from './core/helpers/uuid.provider';
import { ArgonHasher } from './core/adapters/hash/argon-hasher.adapter';
import { AuthUsersController } from './auth/api/auth-user.controller';
import { SignUpUseCase } from './auth/application/use-cases/sign-up.use-case';
import { VerifyEmailUseCase } from './auth/application/use-cases/verify-email.use-case';
import { ResendVerificationUseCase } from './auth/application/use-cases/resend-verification.use-case';

const configs = [UserAccountConfig];
const adapters = [ArgonHasher];
const strategies = [];
const controllers = [UsersController, PostsController, AuthUsersController];
const services = [UsersService, PostsService];
const useCases = [SignUpUseCase, VerifyEmailUseCase, ResendVerificationUseCase];
const queries = [];
const repositories = [
  UsersRepository,
  UsersQueryRepository,
  PostsRepository,
  PostsQueryRepository,
];

@Module({
  imports: [TypeOrmModule.forFeature([User, EmailConfirmation]), CqrsModule],
  controllers: [...controllers],
  providers: [
    UuidProvider,
    ...configs,
    ...services,
    ...repositories,
    ...useCases,
    ...adapters,
  ],
})
export class UserAccountsModule {}
