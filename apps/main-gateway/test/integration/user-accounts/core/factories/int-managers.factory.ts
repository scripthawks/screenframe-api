import { AuthIntManager } from '../managers/auth.int-manager';

export class IntManagersFactory {
  getAuth() {
    return new AuthIntManager();
  }
}
