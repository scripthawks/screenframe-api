import { INestApplication } from '@nestjs/common';
import { CoreConfig } from '../config';
import {
  AllExceptionsFilter,
  DomainExceptionFilter,
  RepositoryExceptionFilter,
} from '../filters';

export function exceptionFiltersSetup(
  app: INestApplication,
  config: CoreConfig,
) {
  app.useGlobalFilters(
    new RepositoryExceptionFilter(config),
    new DomainExceptionFilter(config),
    new AllExceptionsFilter(config),
  );
}
