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
import { UserCleanupService } from './core/services/cleanup/user-cleanup.service';
import { ScheduleModule } from '@nestjs/schedule';
import { JwtStrategy } from '../core/strategies/jwt-access.strategy';
import { LocalStrategy } from './core/strategies/local.strategy';
import { LoginUserUseCase } from './auth/application/use-cases/login-user.use-case';
import { AuthService } from './auth/application/auth.service';
import { JwtService } from '@nestjs/jwt';
import { GetInfoAboutCurrentUserQueryHandler } from './auth/application/queries/get-info-about-current-user.query';
import { SessionsRepository } from './sessions/infrastructure/sessions.repository';
import { Session } from './sessions/domain/session.entity';
import { RefreshStrategy } from './core/strategies/refresh.stategy';
import { RefreshTokenUseCase } from './auth/application/use-cases/refresh-token.use-case';
import { SessionCleanupService } from './core/services/cleanup/session-cleanup.service';
import { LogoutUseCase } from './auth/application/use-cases/logout.use-case';
import { SessionsController } from './sessions/api/sessions.controller';
import { GetSessionsQueryHandler } from './sessions/application/queries/get-sessions.query';
import { SessionsQueryRepository } from './sessions/infrastructure/sessions.query-repository';
import { DeleteAllSessionsExcludingCurrentUseCase } from './sessions/application/use-cases/delete-all-sessions-excluding-current.use-case';
import { DeleteSessionUseCase } from './sessions/application/use-cases/delete-security-device.use-case';

const configs = [UserAccountConfig];
const adapters = [ArgonHasher];
const strategies = [LocalStrategy, RefreshStrategy, JwtStrategy];
const controllers = [
  UsersController,
  PostsController,
  AuthController,
  SessionsController,
];
const services = [
  JwtService,
  AuthService,
  UserCleanupService,
  SessionCleanupService,
  UsersService,
  PostsService,
];
const useCases = [
  RefreshTokenUseCase,
  LoginUserUseCase,
  LogoutUseCase,
  SignUpUseCase,
  VerifyEmailUseCase,
  ResendVerificationUseCase,
  DeleteAllSessionsExcludingCurrentUseCase,
  DeleteSessionUseCase,
];
const queries = [GetInfoAboutCurrentUserQueryHandler, GetSessionsQueryHandler];
const repositories = [
  UsersRepository,
  UsersQueryRepository,
  SessionsRepository,
  SessionsQueryRepository,
  PostsRepository,
  PostsQueryRepository,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([User, EmailConfirmation, Session]),
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
    ...queries,
    ...repositories,
    ...useCases,
    ...adapters,
  ],
})
export class UserAccountsModule {}
