import { CoreConfig } from '@app/core/config';
import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { MainModule } from '../../../src/main.module';
import { coreSetup } from '@app/core/setup';
import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';

export const initTestApp = async (): Promise<{
  app: INestApplication<App>;
  coreConfig: CoreConfig;
}> => {
  const testingModuleBuilder: TestingModuleBuilder = Test.createTestingModule({
    imports: [MainModule],
  });

  const testingAppModule = await testingModuleBuilder.compile();
  const app: INestApplication<App> = testingAppModule.createNestApplication();

  const coreConfig = app.get<CoreConfig>(CoreConfig);
  coreSetup(app, coreConfig);

  await app.init();

  return {
    app,
    coreConfig,
  };
};
