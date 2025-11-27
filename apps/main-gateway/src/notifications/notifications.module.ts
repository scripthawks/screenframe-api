import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { NotificationConfig } from './core/config/notification.config';
import { mailOptions } from './core/options/mail.options';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  providers: [NotificationConfig],
  exports: [NotificationConfig],
})
class NotificationConfigModule {}

const services = [];
const eventHandlers = [];
const templates = [];

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
