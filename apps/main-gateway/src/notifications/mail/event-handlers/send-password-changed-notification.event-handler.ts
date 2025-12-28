import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { MailService } from '../services/mail.service';
import { NewPasswordEvent } from '../../../user-accounts/auth/application/events/new-password.event';

@EventsHandler(NewPasswordEvent)
export class SendPasswordChangedNotificationEventHandler
  implements IEventHandler<NewPasswordEvent>
{
  constructor(private readonly mailService: MailService) {}
  async handle(event: NewPasswordEvent): Promise<void> {
    const { userName, email } = event;
    await this.mailService.sendPasswordChangedNotification(userName, email);
  }
}
