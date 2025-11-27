import { configValidationUtility } from './config-validation.utility';

export abstract class BaseConfig {
  protected validateConfig(): void {
    configValidationUtility.validateConfig(this);
  }
}
