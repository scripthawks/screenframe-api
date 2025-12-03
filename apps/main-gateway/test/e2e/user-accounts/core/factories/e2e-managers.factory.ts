import { AuthE2eManager } from '../managers/auth-e2e.manager';

export class E2eManagersFactory {
  getAuth() {
    return new AuthE2eManager();
  }
}
