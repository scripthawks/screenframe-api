import { Injectable } from '@nestjs/common';
import { NotificationConfig } from '../../core/config/notification.config';

@Injectable()
export class EmailConfirmationTemplate {
  constructor(private readonly notificationConfig: NotificationConfig) {}
  render(token: string): string {
    const url = `${this.notificationConfig.CLIENT_URL}${this.notificationConfig.VERIFY_EMAIL_PATH}`;
    return `
   <!DOCTYPE html>
      <html>
      <head>
          <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
              .container { max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 10px; }
              .button { display: inline-block; padding: 14px 28px; background-color: #007bff;
                        color: white; text-decoration: none; border-radius: 6px; font-size: 16px;
                        border: none; cursor: pointer; font-weight: bold; }
              .code-box { background: #f8f9fa; padding: 15px; border-radius: 6px; margin: 20px 0;
                         font-family: monospace; word-break: break-all; font-size: 14px; }
              .footer { margin-top: 25px; font-size: 12px; color: #666; border-top: 1px solid #e0e0e0; padding-top: 15px; }
          </style>
      </head>
      <body>
          <div class="container">
              <h1 style="color: #28a745; text-align: center;">🎉 Welcome to Our App!</h1>
              <p>Thank you for registering. To activate your account, please confirm your email address using one of the methods below:</p>

              <div style="text-align: center; margin: 30px 0;">
                  <a href="${url}?code=${token}" class="button">Confirm Email Address</a>
              </div>

              <p><strong>Or use this confirmation code manually:</strong></p>
              <div class="code-box">
                  <strong>Confirmation Code:</strong><br>
                  ${token}
              </div>

              <div class="footer">
                  <p>If you didn't create this account, please ignore this email.</p>
                  <p>This confirmation code will expire in 1 hours.</p>
              </div>
          </div>
      </body>
      </html>
    `;
  }
}
