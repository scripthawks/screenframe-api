import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { configValidationUtility } from './config-validation.utility';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';
import { Environments } from '../enums';
import { BaseConfig } from './base.config';

@Injectable()
export class CoreConfig extends BaseConfig {
  @IsEnum(Environments, {
    message:
      'Set correct NODE_ENV value, available values: ' +
      configValidationUtility.getEnumValues(Environments).join(', '),
  })
  ENV: Environments;

  @Min(1, {
    message:
      'Set Env variable PORT, must be a positive number greater than 0, GROUP: Dangerous!',
  })
  @IsNumber({}, { message: 'Env variable PORT must be a number' })
  PORT: number;

  @IsNotEmpty({
    message: 'Set Env variable GLOBAL_PREFIX, GROUP: Dangerous!',
  })
  @IsString()
  GLOBAL_PREFIX: string;

  @IsBoolean({
    message:
      'Set Env variable IS_SWAGGER_ENABLED to enable/disable, available values: true, false, 1, 0, GROUP: Dangerous!',
  })
  IS_SWAGGER_ENABLED: boolean;

  @IsNotEmpty({ message: 'DATABASE_URL is required for database connection!' })
  @IsString()
  DATABASE_URL: string;

  @IsBoolean({
    message:
      'Set Env variable IS_DB_SYNCHRONIZE to enable/disable, available values: true, false, 1, 0, GROUP: Dangerous!',
  })
  IS_DB_SYNCHRONIZE: boolean;

  @IsBoolean({
    message:
      'Set Env variable IS_DB_LOGGING to enable/disable, available values: true, false, 1, 0, GROUP: Dangerous!',
  })
  IS_DB_LOGGING: boolean;

  constructor(private configService: ConfigService) {
    super();
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

    this.validateConfig();
  }
}
