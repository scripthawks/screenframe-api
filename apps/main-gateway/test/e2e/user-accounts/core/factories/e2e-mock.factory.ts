import { SendSignUpConfirmationEmailEventHandlerMock } from '../mocks/send-sign-up-confirmation-email.event-handler.mock';
import { MailServiceMock } from '../mocks/mail-service.mock';

export class E2eMockFactory {
  static getSendSignUpConfirmationEmailEventHandlerMock() {
    return new SendSignUpConfirmationEmailEventHandlerMock();
  }
  static getMailServiceMock() {
    return new MailServiceMock();
  }
}
