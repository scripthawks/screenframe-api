import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { MainModule } from '../../../src/main.module';
import { INestApplication, Provider, Type } from '@nestjs/common';
import { CoreConfig } from '@app/core/config';
import { App } from 'supertest/types';
import { coreSetup } from '@app/core/setup';

export interface TestAppResult {
  app: INestApplication<App>;
  module?: TestingModule;
  coreConfig?: CoreConfig;
}

export class TestAppFactory {
  static async createE2E(): Promise<TestAppResult> {
    const testingModuleBuilder: TestingModuleBuilder = Test.createTestingModule(
      {
        imports: [MainModule],
      },
    );
    const module = await testingModuleBuilder.compile();
    const app: INestApplication<App> = module.createNestApplication();
    const coreConfig = app.get<CoreConfig>(CoreConfig);
    coreSetup(app, coreConfig);

    await app.init();
    return {
      app,
      coreConfig,
    };
  }

  static async createInt(
    modules: any[],
    mocks: Array<{ provide: any; useValue: any }> = [],
  ): Promise<TestAppResult> {
    const testingModuleBuilder: TestingModuleBuilder = Test.createTestingModule(
      {
        imports: modules,
      },
    );
    mocks.forEach(({ provide, useValue }) => {
      testingModuleBuilder.overrideProvider(provide).useValue(useValue);
    });

    const module = await testingModuleBuilder.compile();
    const app: INestApplication<App> = module.createNestApplication();
    await app.init();

    return { app, module };
  }

  static async createUnit<T>(
    serviceClass: Type<T>,
    dependencies: Provider[] = [],
  ): Promise<T> {
    const providers = [serviceClass, ...dependencies];
    const module = await Test.createTestingModule({ providers }).compile();
    return module.get<T>(serviceClass);
  }
}
