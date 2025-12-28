import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailConfirmationTemplate } from '../templates/email-confirmation.template';
import { PasswordRecoveryTemplate } from '../templates/password-recovery.template';
import { NewPasswordTemplate } from '../templates/new-password.template';

@Injectable()
export class MailService {
  constructor(
    private readonly mailService: MailerService,
    private readonly emailConfirmationTemplate: EmailConfirmationTemplate,
    private readonly passwordRecoveryTemplate: PasswordRecoveryTemplate,
    private readonly newPasswordTemplate: NewPasswordTemplate,
  ) {}
  async sendSignUpEmail(
    userName: string,
    email: string,
    token: string,
  ): Promise<void> {
    const htmlContent = this.emailConfirmationTemplate.render(token);
    await this.mailService.sendMail({
      to: email,
      subject: `Welcome ${userName}! Confirm your email`,
      html: htmlContent,
    });
  }

  async sendPasswordRecoveryEmail(
    userName: string,
    token: string,
    email: string,
  ): Promise<void> {
    const htmlContent = this.passwordRecoveryTemplate.render(userName, token);
    await this.mailService.sendMail({
      to: email,
      subject: `Welcome ${userName}! Confirm your password recovery`,
      html: htmlContent,
    });
  }

  async sendPasswordChangedNotification(
    userName: string,
    email: string,
  ): Promise<void> {
    const htmlContent = this.newPasswordTemplate.render(userName);
    await this.mailService.sendMail({
      to: email,
      subject: `Welcome ${userName}! Your password has been changed`,
      html: htmlContent,
    });
  }
}
