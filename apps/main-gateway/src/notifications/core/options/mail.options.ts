import { NotificationConfig } from '../config/notification.config';
import { MailerOptions } from '@nestjs-modules/mailer';

export function mailOptions(
  notificationConfig: NotificationConfig,
): MailerOptions {
  return {
    transport: {
      service: notificationConfig.MAIL_SERVICE,
      auth: {
        user: notificationConfig.MAIL_USER,
        pass: notificationConfig.MAIL_PASS,
      },
      tls: {
        rejectUnauthorized: notificationConfig.IZ_MAILER_TLS_VERIFICATION,
      },
    },
  };
}
