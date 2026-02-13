import { UserSignUpEvent } from '../../../../../src/user-accounts/auth/application/events/sign-up-user.event';

export class SendSignUpConfirmationEmailEventHandlerMock {
  sentEmails: { userName: string; confirmationToken: string; email: string }[] =
    [];
  async handle(event: UserSignUpEvent) {
    this.sentEmails.push(event);
    console.log(`[MOCK] Username: ${event.userName}`);
    console.log(`[MOCK] Confirmation token: ${event.confirmationToken}`);
    console.log(`[MOCK] Email confirmation sent to: ${event.email}`);
    return Promise.resolve();
  }

  clearSentEmails(): void {
    console.log('clearSentEmails');
    this.sentEmails = [];
  }
}
