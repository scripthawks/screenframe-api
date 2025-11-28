import { Injectable } from '@nestjs/common';
import { NotificationConfig } from '../../core/config/notification.config';

@Injectable()
export class EmailConfirmationTemplate {
  constructor(private readonly notificationConfig: NotificationConfig) {}
  render(token: string): string {
    const url = `${this.notificationConfig.CLIENT_URL}${this.notificationConfig.VERIFY_EMAIL_PATH}`;
    return `<h1>Thanks for your registration</h1>
 <p>To finish registration please follow the link below: <br>
     <a href='${url}?code=${token}'>complete registration</a>
 </p>`;
  }
}
