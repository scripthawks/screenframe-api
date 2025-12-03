import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { TestAppFactory } from '../../../core/factories/test-app.factory';
import { AuthController } from '../../../../src/user-accounts/auth/api/auth.controller';
import { CommandBus } from '@nestjs/cqrs';

describe('int-Auth', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const mockCommandBus = {
      execute: jest.fn().mockResolvedValue({ success: true }),
    };

    const result = await TestAppFactory.createInt(
      [],
      [
        { provide: AuthController, useValue: AuthController },

        { provide: CommandBus, useValue: mockCommandBus },
        { provide: 'QueryBus', useValue: { execute: jest.fn() } },
      ],
    );

    app = result.app;
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
    jest.clearAllMocks();
  });

  describe('POST /auth/signup', () => {
    it('should create app successfully with createInt', () => {
      expect(app).toBeDefined();
      expect(app.getHttpServer()).toBeDefined();
    });
  });
});
