export class MailServiceMock {
  sentEmails: { userName: string; email: string; token: string }[] = [];
  sendSignUpEmail = jest
    .fn()
    .mockImplementation(
      async (userName: string, email: string, token: string) => {
        console.log(
          `[MOCK] sendSignUpEmail called:${userName},${email},${token}`,
        );
        this.sentEmails.push({ userName, email, token });
        return Promise.resolve();
      },
    );

  clearSentEmails(): void {
    this.sentEmails = [];
  }
}
