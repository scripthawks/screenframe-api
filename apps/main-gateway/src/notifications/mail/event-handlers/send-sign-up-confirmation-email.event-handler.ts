import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserSignUpEvent } from '../../../user-accounts/auth/application/events/sign-up-user.event';
import { MailService } from '../services/mail.service';

@EventsHandler(UserSignUpEvent)
export class SendSignUpConfirmationEmailEventHandler
  implements IEventHandler<UserSignUpEvent>
{
  constructor(private readonly mailService: MailService) {}
  handle(event: UserSignUpEvent): void {
    const { userName, email, confirmationToken } = event;
    this.mailService.sendSignUpEmail(userName, email, confirmationToken);
  }
}
