import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailConfirmationTemplate } from '../templates/email-confirmation.template';

@Injectable()
export class MailService {
  constructor(
    private readonly mailService: MailerService,
    private readonly emailConfirmationTemplate: EmailConfirmationTemplate,
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
}
