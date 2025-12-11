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
import { AuthController } from './auth/api/auth.controller';
import { SignUpUseCase } from './auth/application/use-cases/sign-up.use-case';
import { VerifyEmailUseCase } from './auth/application/use-cases/verify-email.use-case';
import { ResendVerificationUseCase } from './auth/application/use-cases/resend-verification.use-case';
import { ThrottlerModule } from '@nestjs/throttler';
import { UserCleanupService } from './core/services/user-cleanup.service';
import { ScheduleModule } from '@nestjs/schedule';
import { JwtStrategy } from '../core/strategies/jwt-access.strategy';
import { LocalStrategy } from './core/strategies/local.strategy';
import { LoginUserUseCase } from './auth/application/use-cases/login-user.use-case';
import { AuthService } from './auth/application/auth.service';
import { JwtService } from '@nestjs/jwt';

const configs = [UserAccountConfig];
const adapters = [ArgonHasher];
const strategies = [LocalStrategy, JwtStrategy];
const controllers = [UsersController, PostsController, AuthController];
const services = [
  JwtService,
  AuthService,
  UserCleanupService,
  UsersService,
  PostsService,
];
const useCases = [
  LoginUserUseCase,
  SignUpUseCase,
  VerifyEmailUseCase,
  ResendVerificationUseCase,
];
const queries = [];
const repositories = [
  UsersRepository,
  UsersQueryRepository,
  PostsRepository,
  PostsQueryRepository,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([User, EmailConfirmation]),
    CqrsModule,
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        name: 'auth',
        ttl: 10000,
        limit: 5,
      },
    ]),
  ],
  controllers: [...controllers],
  providers: [
    UuidProvider,
    ...strategies,
    ...configs,
    ...services,
    ...repositories,
    ...useCases,
    ...adapters,
  ],
})
export class UserAccountsModule {}
