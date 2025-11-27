import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { NotificationConfig } from './core/config/notification.config';
import { mailOptions } from './core/options/mail.options';
import { MailService } from './mail/services/mail.service';
import { SendSignUpConfirmationEmailEventHandler } from './mail/event-handlers/send-sign-up-confirmation-email.event-handler';
import { CqrsModule } from '@nestjs/cqrs';
import { EmailConfirmationTemplate } from './mail/templates/email-confirmation.template';

@Module({
  providers: [NotificationConfig],
  exports: [NotificationConfig],
})
class NotificationConfigModule {}

const services = [MailService];
const eventHandlers = [SendSignUpConfirmationEmailEventHandler];
const templates = [EmailConfirmationTemplate];

@Module({
  imports: [
    CqrsModule,
    NotificationConfigModule,
    MailerModule.forRootAsync({
      imports: [NotificationConfigModule],
      useFactory: mailOptions,
      inject: [NotificationConfig],
    }),
  ],
  providers: [...services, ...eventHandlers, ...templates],
})
export class NotificationsModule {}
