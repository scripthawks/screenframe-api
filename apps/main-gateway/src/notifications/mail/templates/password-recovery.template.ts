import { Injectable } from '@nestjs/common';
import { NotificationConfig } from '../../core/config/notification.config';
import { TimeFormatter } from '../../../user-accounts/core/helpers/time-formatter';
import { PASSWORD_RECOVERY_TOKEN_EXPIRY } from '../../../user-accounts/core/constants/dto.constants';

@Injectable()
export class PasswordRecoveryTemplate {
  constructor(private readonly notificationConfig: NotificationConfig) {}
  render(userName: string, token: string): string {
    const url = `${this.notificationConfig.CLIENT_URL}${this.notificationConfig.PASSWORD_RECOVERY_PATH}?code=${token}`;
    const expirationText = TimeFormatter.formatExpirationTime(
      PASSWORD_RECOVERY_TOKEN_EXPIRY,
    );
    return `
   <!DOCTYPE html>
      <html>
      <head>
      <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Recovery</title>
          <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
              .container { max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 10px; }
              .warning { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 10px; border-radius: 4px; margin: 20px 0; }
          </style>
      </head>
        <body>
          <div class="container">
              <h1 style="color: #dc3545; text-align: center;">🔒 Password Recovery</h1> 
              <p>Hello ${userName},</p>  
              <p>We received a request to reset the password for your account. If you made this request, please click the button below to create a new password:</p>

              <div style="text-align: center; margin: 30px 0;">
                  <a href="${url}" style="display: inline-block; padding: 14px 28px; background-color: #dc3545; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-size: 16px; border: none; cursor: pointer; font-weight: bold;">Reset Your Password</a>
              </div>
              <div class="warning">
                  <strong>⚠️ Security Notice:</strong>
                  This password reset link will expire in <strong>${expirationText}</strong>.<br>
                  Please do not share this link with anyone.<br>
                  If you didn't request a password reset, please ignore this email.<br>
                  All your active sessions will be terminated when you reset your password.<br>
              </div>
          </div>
      </body>
      </html>
    `;
  }
}
