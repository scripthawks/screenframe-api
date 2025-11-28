import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { BaseConfig, configValidationUtility } from '@app/core/config';

@Injectable()
export class NotificationConfig extends BaseConfig {
  @IsNotEmpty({
    message: 'Set Env variable MAIL_SERVICE, GROUP: Infrastructure!',
  })
  @IsString()
  MAIL_SERVICE: string;

  @IsNotEmpty({
    message: 'Set Env variable MAIL_USER, GROUP: Infrastructure!',
  })
  @IsString()
  MAIL_USER: string;

  @IsNotEmpty({
    message: 'Set Env variable MAIL_PASS, GROUP: Dangerous!',
  })
  @IsString()
  MAIL_PASS: string;

  @IsNotEmpty({
    message: 'Set Env variable CLIENT_URL, GROUP: Infrastructure!',
  })
  @IsString()
  CLIENT_URL: string;

  @IsNotEmpty({
    message: 'Set Env variable VERIFY_EMAIL_PATH, GROUP: Infrastructure!',
  })
  @IsString()
  VERIFY_EMAIL_PATH: string;

  @IsBoolean({
    message:
      'Set Env variable IZ_MAILER_TLS_VERIFICATION to enable/disable, available values: true, false, 1, 0, GROUP: Infrastructure!',
  })
  IZ_MAILER_TLS_VERIFICATION: boolean;

  constructor(private configService: ConfigService) {
    super();
    this.CLIENT_URL = this.configService.getOrThrow('CLIENT_URL');
    this.VERIFY_EMAIL_PATH = this.configService.getOrThrow('VERIFY_EMAIL_PATH');
    this.MAIL_SERVICE = this.configService.getOrThrow('MAIL_SERVICE');
    this.MAIL_USER = this.configService.getOrThrow('MAIL_USER');
    this.MAIL_PASS = this.configService.getOrThrow('MAIL_PASS');
    this.IZ_MAILER_TLS_VERIFICATION = configValidationUtility.convertToBoolean(
      this.configService.getOrThrow('IZ_MAILER_TLS_VERIFICATION'),
    );
    this.validateConfig();
  }
}
