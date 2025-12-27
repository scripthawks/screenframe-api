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
import { SessionRepository } from './sessions/infrastructure/session.repository';
import { Session } from './sessions/domain/session.entity';
import { RefreshStrategy } from './core/strategies/refresh.stategy';
import { RefreshTokenUseCase } from './auth/application/use-cases/refresh-token.use-case';
import { SessionCleanupService } from './core/services/cleanup/session-cleanup.service';
import { LogoutUseCase } from './auth/application/use-cases/logout.use-case';
import { PasswordRecovery } from './users/domain/password-recovery.entity';
import { PasswordRecoveryUseCase } from './auth/application/use-cases/password-recovery.use-case';
import { RecaptchaService } from './auth/application/services/recaptcha.service';
import { HttpModule } from '@nestjs/axios';
import {
  THROTTLER_AUTH_LIMIT,
  THROTTLER_AUTH_NAME,
  THROTTLER_AUTH_TTL,
} from './core/constants/dto.constants';
import { CheckRecoveryTokenUseCase } from './auth/application/use-cases/check-recovery-token.use-case';

const configs = [UserAccountConfig];
const adapters = [ArgonHasher];
const strategies = [LocalStrategy, RefreshStrategy, JwtStrategy];
const controllers = [UsersController, PostsController, AuthController];
const services = [
  JwtService,
  AuthService,
  UserCleanupService,
  SessionCleanupService,
  UsersService,
  PostsService,
  RecaptchaService,
];
const useCases = [
  RefreshTokenUseCase,
  LoginUserUseCase,
  LogoutUseCase,
  SignUpUseCase,
  VerifyEmailUseCase,
  ResendVerificationUseCase,
  PasswordRecoveryUseCase,
  CheckRecoveryTokenUseCase,
];
const queries = [GetInfoAboutCurrentUserQueryHandler];
const repositories = [
  UsersRepository,
  UsersQueryRepository,
  SessionRepository,
  PostsRepository,
  PostsQueryRepository,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      EmailConfirmation,
      Session,
      PasswordRecovery,
    ]),
    CqrsModule,
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        name: THROTTLER_AUTH_NAME,
        ttl: THROTTLER_AUTH_TTL,
        limit: THROTTLER_AUTH_LIMIT,
      },
    ]),
    HttpModule,
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
