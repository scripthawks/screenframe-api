import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailConfirmationTemplate } from '../templates/email-confirmation.template';
import { PasswordRecoveryTemplate } from '../templates/password-recovery.template';

@Injectable()
export class MailService {
  constructor(
    private readonly mailService: MailerService,
    private readonly emailConfirmationTemplate: EmailConfirmationTemplate,
    private readonly passwordRecoveryTemplate: PasswordRecoveryTemplate,
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
}
