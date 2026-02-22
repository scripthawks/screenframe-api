import { AuthE2eManager } from '../managers/auth-e2e.manager';
import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';

export class E2eManagersFactory {
  static getAuth(app: INestApplication<App>): AuthE2eManager {
    return new AuthE2eManager(app);
  }
}
