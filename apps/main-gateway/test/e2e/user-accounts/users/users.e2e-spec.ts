import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { TestAppFactory } from '../../../core/factories/test-app.factory';

describe('e2e-Users', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const result = await TestAppFactory.createE2E();
    app = result.app;
  });
  afterAll(async () => {
    await app.close();
  });
  describe("GET/users'", () => {
    it('should return users : STATUS 200', async () => {
      return request(app.getHttpServer())
        .get('/api/v1/users')
        .expect(200)
        .expect('Users found');
    });
  });
});
