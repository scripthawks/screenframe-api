import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseConfig } from '@app/core/config';
import { IsNumber } from 'class-validator';

@Injectable()
export class UserAccountConfig extends BaseConfig {
  @IsNumber(
    {},
    {
      message: 'Set Env variable VERIFY_TOKEN_EXPIRATION, GROUP: Dangerous!',
    },
  )
  CONFIRMATION_TOKEN_EXPIRATION: number;

  constructor(private configService: ConfigService) {
    super();
    this.CONFIRMATION_TOKEN_EXPIRATION = Number(
      this.configService.getOrThrow('VERIFY_TOKEN_EXPIRATION'),
    );
    this.validateConfig();
  }
}
