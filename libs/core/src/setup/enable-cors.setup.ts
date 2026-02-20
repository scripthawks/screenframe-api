import { INestApplication } from '@nestjs/common';
import { CoreConfig } from '../config';

export function enableCorsSetup(app: INestApplication, coreConfig: CoreConfig) {
  const corsOrigins = coreConfig.CORS_ORIGINS.split(',').map((origin) =>
    origin.trim(),
  );

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization'],
    exposedHeaders: ['Authorization'],
    maxAge: 3600,
  });
}
