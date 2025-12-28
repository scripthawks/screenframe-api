import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { PasswordRecoveryRequestedEvent } from '../../../user-accounts/auth/application/events/password-recovery-requested.event';
import { MailService } from '../services/mail.service';

@EventsHandler(PasswordRecoveryRequestedEvent)
export class SendEmailWithRecoveryTokenEventHandler
  implements IEventHandler<PasswordRecoveryRequestedEvent>
{
  constructor(private readonly mailService: MailService) {}
  async handle(event: PasswordRecoveryRequestedEvent): Promise<void> {
    const { userName, recoveryToken, email } = event;
    await this.mailService.sendPasswordRecoveryEmail(
      userName,
      recoveryToken,
      email,
    );
  }
}
