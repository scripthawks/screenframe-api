import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CoreConfig } from '../config';

export function swaggerSetup(app: INestApplication, coreConfig: CoreConfig) {
  if (coreConfig.IS_SWAGGER_ENABLED) {
    const config = new DocumentBuilder()
      .setTitle('Screenframe API')
      .setDescription('API for screenframe')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(coreConfig.GLOBAL_PREFIX + '/swagger', app, document, {
      customSiteTitle: 'screenframe-api',
    });
  }
}
