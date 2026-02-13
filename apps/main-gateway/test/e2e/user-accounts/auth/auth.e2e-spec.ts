import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { TestAppFactory } from '../../../core/factories/test-app.factory';
import { clearDatabase } from '../../../core/helpers/clear-database';
import { E2eManagersFactory } from '../core/factories/e2e-managers.factory';
import { AuthE2eManager } from '../core/managers/auth-e2e.manager';
import { E2eDtoFactory } from '../core/factories/e2e-dto.factory';
import { SignUpUserInputDto } from '../../../../src/user-accounts/auth/api/input-dto/sign-up.input-dto';
import { E2eMockFactory } from '../core/factories/e2e-mock.factory';
import { MailServiceMock } from '../core/mocks/mail-service.mock';
import { MailService } from '../../../../src/notifications/mail/services/mail.service';

describe('e2e-Auth', () => {
  let app: INestApplication<App>;
  let authE2eManager: AuthE2eManager;
  let validSignUpDto: SignUpUserInputDto;
  let mailServiceMock: MailServiceMock;

  beforeAll(async () => {
    mailServiceMock = E2eMockFactory.getMailServiceMock();
    const result = await TestAppFactory.createE2E([
      {
        provide: MailService,
        useValue: mailServiceMock,
      },
    ]);
    app = result.app;
    authE2eManager = E2eManagersFactory.getAuth(app);
    validSignUpDto = E2eDtoFactory.createValidSignUpInputDto();
  });
  beforeEach(async () => {
    await clearDatabase(app);
  });
  afterEach(async () => {
    await clearDatabase(app);
    mailServiceMock.clearSentEmails();
  });
  afterAll(async () => {
    await app.close();
  });
  describe('POST/auth/verify-email', () => {
    beforeEach(async (): Promise<void> => {
      await authE2eManager.signUp(validSignUpDto);
    });
    it(`should confirm the user registration in system : STATUS 204`, () => {
      // todo !! Continue from this place. It's just a sketch. !!
      expect(mailServiceMock.sentEmails).toHaveLength(1);
      expect(mailServiceMock.sendSignUpEmail).toHaveBeenCalled();
      expect(mailServiceMock.sendSignUpEmail).toBeCalledTimes(1);
    });
  });
});
