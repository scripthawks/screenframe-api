import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseConfig } from '@app/core/config';
import { IsNumber, IsString } from 'class-validator';

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

  constructor(private configService: ConfigService) {
    super();

    this.CONFIRMATION_TOKEN_EXPIRATION = Number(
      this.configService.getOrThrow('CONFIRMATION_TOKEN_EXPIRATION'),
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

    this.validateConfig();
  }
}
