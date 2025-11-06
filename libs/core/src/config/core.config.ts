import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { configValidationUtility } from './config-validation.utility';
import { IsBoolean, IsEnum, IsNumber, IsString } from 'class-validator';
import { Environments } from '../enums';

@Injectable()
export class CoreConfig {
  @IsEnum(Environments, {
    message:
      'Set correct NODE_ENV value, available values: ' +
      configValidationUtility.getEnumValues(Environments).join(', '),
  })
  ENV: Environments;

  @IsNumber({}, { message: 'Set Env variable PORT, example: 3000' })
  PORT: number;

  @IsString({
    message: 'Set Env variable GLOBAL_PREFIX, dangerous for security!',
  })
  GLOBAL_PREFIX: string;

  @IsBoolean({
    message:
      'Set Env variable IS_SWAGGER_ENABLED to enable/disable, available values: true, false, 1, 0, dangerous for security!',
  })
  IS_SWAGGER_ENABLED: boolean;

  @IsString({ message: 'DATABASE_URL is required for database connection!' })
  DATABASE_URL: string;

  @IsBoolean({
    message:
      'Set Env variable IS_DB_SYNCHRONIZE to enable/disable, available values: true, false, 1, 0, dangerous for production!',
  })
  IS_DB_SYNCHRONIZE: boolean;

  @IsBoolean({
    message:
      'Set Env variable IS_DB_LOGGING to enable/disable, available values: true, false, 1, 0',
  })
  IS_DB_LOGGING: boolean;

  constructor(private configService: ConfigService) {
    this.ENV = this.configService.getOrThrow('NODE_ENV');
    this.PORT = Number(this.configService.getOrThrow('PORT'));
    this.GLOBAL_PREFIX = this.configService.getOrThrow('GLOBAL_PREFIX');
    this.IS_SWAGGER_ENABLED = configValidationUtility.convertToBoolean(
      this.configService.getOrThrow('IS_SWAGGER_ENABLED'),
    );

    this.DATABASE_URL = this.configService.getOrThrow('DATABASE_URL');
    this.IS_DB_SYNCHRONIZE = configValidationUtility.convertToBoolean(
      this.configService.getOrThrow('IS_DB_SYNCHRONIZE'),
    );
    this.IS_DB_LOGGING = configValidationUtility.convertToBoolean(
      this.configService.getOrThrow('IS_DB_LOGGING'),
    );

    configValidationUtility.validateConfig(this);
  }
}
