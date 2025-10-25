import { INestApplication } from '@nestjs/common';
import {
  cookieParserSetup,
  enableCorsSetup,
  globalPrefixSetup,
  pipesSetup,
  swaggerSetup,
} from '.';
import { CoreConfig } from '../config';

export function coreSetup(app: INestApplication, coreConfig: CoreConfig) {
  globalPrefixSetup(app, coreConfig);
  enableCorsSetup(app);
  cookieParserSetup(app);
  pipesSetup(app);
  swaggerSetup(app, coreConfig);
}
