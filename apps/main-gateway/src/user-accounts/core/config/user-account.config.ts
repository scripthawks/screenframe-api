import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseConfig, CoreConfig } from '@app/core/config';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { NotificationConfig } from '../../../notifications/core/config/notification.config';

@Injectable()
export class UserAccountConfig extends BaseConfig {
  @IsNumber(
    {},
    {
      message:
        'Set Env variable CONFIRMATION_TOKEN_EXPIRATION, GROUP: Dangerous!',
    },
  )
  CONFIRMATION_TOKEN_EXPIRATION: number;

  @IsString({
    message: 'Set Env variable ACCESS_TOKEN_SECRET, GROUP: Dangerous!',
  })
  ACCESS_TOKEN_SECRET: string;

  @IsString({
    message: 'Set Env variable ACCESS_TOKEN_EXPIRATION, GROUP: Dangerous!',
  })
  ACCESS_TOKEN_EXPIRATION: string;

  @IsString({
    message: 'Set Env variable REFRESH_TOKEN_SECRET, GROUP: Dangerous!',
  })
  REFRESH_TOKEN_SECRET: string;

  @IsString({
    message: 'Set Env variable REFRESH_TOKEN_EXPIRATION, GROUP: Dangerous!',
  })
  REFRESH_TOKEN_EXPIRATION: string;

  @IsNumber(
    {},
    {
      message:
        'Set Env variable MAX_SESSIONS_PER_USER, GROUP: Session Management!',
    },
  )
  MAX_SESSIONS_PER_USER: number;

  @IsNumber(
    {},
    {
      message:
        'Set Env variable USER_CLEANUP_BATCH_SIZE, GROUP: Cleanup Configuration!',
    },
  )
  USER_CLEANUP_BATCH_SIZE: number;

  @IsNumber(
    {},
    {
      message:
        'Set Env variable SESSION_CLEANUP_BATCH_SIZE, GROUP: Cleanup Configuration!',
    },
  )
  SESSION_CLEANUP_BATCH_SIZE: number;

  @IsNotEmpty({ message: 'Set Env variable RECAPTCHA_URL, GROUP: RECAPTCHA' })
  @IsString()
  RECAPTCHA_URL: string;

  @IsNotEmpty({
    message: 'Set Env variable RECAPTCHA_SECRET_KEY, GROUP: RECAPTCHA',
  })
  @IsString()
  RECAPTCHA_SECRET_KEY: string;

  @IsString({
    message: 'Set Env variable GITHUB_CLIENT_ID for OAuth',
  })
  GITHUB_CLIENT_ID: string;

  @IsString({
    message: 'Set Env variable GITHUB_CLIENT_SECRET for OAuth',
  })
  GITHUB_CLIENT_SECRET: string;

  @IsString({
    message: 'Set Env variable GITHUB_CALLBACK_PATH for OAuth',
  })
  GITHUB_CALLBACK_PATH: string;

  GITHUB_CALLBACK_URL: string;

  constructor(
    private configService: ConfigService,
    private readonly notificationConfig: NotificationConfig,
    private readonly coreConfig: CoreConfig,
  ) {
    super();

    this.CONFIRMATION_TOKEN_EXPIRATION = Number(
      this.configService.getOrThrow('CONFIRMATION_TOKEN_EXPIRATION'),
    );

    this.SESSION_CLEANUP_BATCH_SIZE = Number(
      this.configService.getOrThrow('SESSION_CLEANUP_BATCH_SIZE'),
    );

    this.ACCESS_TOKEN_SECRET = this.configService.getOrThrow(
      'ACCESS_TOKEN_SECRET',
    );
    this.ACCESS_TOKEN_EXPIRATION = this.configService.getOrThrow(
      'ACCESS_TOKEN_EXPIRATION',
    );
    this.REFRESH_TOKEN_SECRET = this.configService.getOrThrow(
      'REFRESH_TOKEN_SECRET',
    );
    this.REFRESH_TOKEN_EXPIRATION = this.configService.getOrThrow(
      'REFRESH_TOKEN_EXPIRATION',
    );

    this.MAX_SESSIONS_PER_USER = Number(
      this.configService.getOrThrow('MAX_SESSIONS_PER_USER'),
    );

    this.USER_CLEANUP_BATCH_SIZE = Number(
      this.configService.getOrThrow('USER_CLEANUP_BATCH_SIZE'),
    );

    this.SESSION_CLEANUP_BATCH_SIZE = Number(
      this.configService.getOrThrow('SESSION_CLEANUP_BATCH_SIZE'),
    );

    this.GITHUB_CLIENT_ID = this.configService.getOrThrow('GITHUB_CLIENT_ID');

    this.GITHUB_CLIENT_SECRET = this.configService.getOrThrow(
      'GITHUB_CLIENT_SECRET',
    );

    this.GITHUB_CALLBACK_PATH = this.configService.getOrThrow(
      'GITHUB_CALLBACK_PATH',
    );

    this.GITHUB_CALLBACK_URL = `${notificationConfig.CLIENT_URL}${coreConfig.GLOBAL_PREFIX}${this.GITHUB_CALLBACK_PATH}`;

    this.RECAPTCHA_URL = this.configService.getOrThrow('RECAPTCHA_URL');

    this.RECAPTCHA_SECRET_KEY = this.configService.getOrThrow(
      'RECAPTCHA_SECRET_KEY',
    );

    this.validateConfig();
  }
}
