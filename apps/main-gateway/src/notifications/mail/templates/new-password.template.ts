import { Injectable } from '@nestjs/common';
import { NotificationConfig } from '../../core/config/notification.config';

@Injectable()
export class NewPasswordTemplate {
  constructor(private readonly notificationConfig: NotificationConfig) {}
  render(userName: string): string {
    return `
   <!DOCTYPE html>
      <html>
      <head>
      <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Successfully Changed</title>
          <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
              .container { max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 10px; }
              .info { background-color: #f8f9fa; padding: 15px; border-radius: 4px; margin: 20px 0; }
              .warning { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 10px; border-radius: 4px; margin: 20px 0; }
          </style>
      </head>
        <body>
          <div class="container">
              <h1 style="color: #28a745; text-align: center;">🎉 Password Successfully Changed</h1> 
              <p>Hello ${userName},</p>  
               <div class="info">
                  <p><strong>Your password has been successfully updated.</strong></p>
                  <p>• Your new password is now active</p>
                  <p>• All other devices have been logged out</p>
              </div>
              <div class="warning">
                  <strong>⚠️ Security Notice:</strong>
                  <p>If you <strong>did not initiate</strong> this password change:</p>
                  <p>1. Immediately reset your password using the "Forgot Password" option</p>
                  <p>2. Contact our support team</p>
                  <p>3. Review your recent account activity</p>           
              </div>
          </div>
      </body>
      </html>
    `;
  }
}
