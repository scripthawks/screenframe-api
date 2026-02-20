import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailConfirmationTemplate } from '../templates/email-confirmation.template';
import { PasswordRecoveryTemplate } from '../templates/password-recovery.template';
import { NewPasswordTemplate } from '../templates/new-password.template';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    private readonly mailService: MailerService,
    private readonly emailConfirmationTemplate: EmailConfirmationTemplate,
    private readonly passwordRecoveryTemplate: PasswordRecoveryTemplate,
    private readonly newPasswordTemplate: NewPasswordTemplate,
  ) {}
  sendSignUpEmail(userName: string, email: string, token: string): void {
    const htmlContent = this.emailConfirmationTemplate.render(token);
    this.mailService
      .sendMail({
        to: email,
        subject: `Welcome ${userName}! Confirm your email`,
        html: htmlContent,
      })
      .catch((error: Error) => {
        this.logger.error(
          `Failed to send sign-up email to ${email}: ${error.message}`,
        );
      });
  }

  sendPasswordRecoveryEmail(
    userName: string,
    token: string,
    email: string,
  ): void {
    const htmlContent = this.passwordRecoveryTemplate.render(userName, token);
    this.mailService
      .sendMail({
        to: email,
        subject: `Welcome ${userName}! Confirm your password recovery`,
        html: htmlContent,
      })
      .catch((error: Error) => {
        this.logger.error(
          `Failed to send password recovery email to ${email}: ${error.message}`,
        );
      });
  }

  sendPasswordChangedNotification(userName: string, email: string): void {
    const htmlContent = this.newPasswordTemplate.render(userName);
    this.mailService
      .sendMail({
        to: email,
        subject: `Welcome ${userName}! Your password has been changed`,
        html: htmlContent,
      })
      .catch((error: Error) => {
        this.logger.error(
          `Failed to send password change notification to ${email}: ${error.message}`,
        );
      });
  }
}
