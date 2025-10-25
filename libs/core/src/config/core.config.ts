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

  constructor(private configService: ConfigService) {
    this.ENV = this.configService.getOrThrow('NODE_ENV');
    this.PORT = Number(this.configService.getOrThrow('PORT'));
    this.GLOBAL_PREFIX = this.configService.getOrThrow('GLOBAL_PREFIX');
    this.IS_SWAGGER_ENABLED = configValidationUtility.convertToBoolean(
      this.configService.getOrThrow('IS_SWAGGER_ENABLED'),
    );

    configValidationUtility.validateConfig(this);
  }
}
