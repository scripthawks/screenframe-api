import { INestApplication } from '@nestjs/common';
import { CoreConfig } from '../config';

export function globalPrefixSetup(
  app: INestApplication,
  coreConfig: CoreConfig,
) {
  app.setGlobalPrefix(coreConfig.GLOBAL_PREFIX);
}
