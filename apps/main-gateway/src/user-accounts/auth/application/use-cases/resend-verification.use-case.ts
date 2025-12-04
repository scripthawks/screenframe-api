import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { DomainException } from '@app/core/exceptions';
import { CommonExceptionCodes } from '@app/core/exceptions/enums';
import { ResendVerificationInputDto } from '../../api/input-dto/resend-verification.input-dto';
import { UserAccountConfig } from '../../../core/config/user-account.config';
import { UuidProvider } from '../../../core/helpers/uuid.provider';
import { UserSignUpEvent } from '../events/sign-up-user.event';

export class ResendVerificationCommand {
  constructor(public inputDto: ResendVerificationInputDto) {}
}

@CommandHandler(ResendVerificationCommand)
export class ResendVerificationUseCase
  implements ICommandHandler<ResendVerificationCommand>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly userAccountConfig: UserAccountConfig,
    private readonly uuidProvider: UuidProvider,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: ResendVerificationCommand) {
    const existingUserByEmail = await this.usersRepository.findByEmailOrFail(
      command.inputDto.email,
    );

    if (existingUserByEmail.isVerified) {
      throw new DomainException(
        CommonExceptionCodes.CONFLICT,
        'Email already confirmed',
      );
    }
    const expirationTime = this.userAccountConfig.CONFIRMATION_TOKEN_EXPIRATION;
    const newConfirmationToken = this.uuidProvider.generate();
    const newExpirationDate = new Date(new Date().getTime() + expirationTime);

    existingUserByEmail.emailConfirmation.update({
      confirmationToken: newConfirmationToken,
      expiresAt: newExpirationDate,
    });

    await this.usersRepository.save(existingUserByEmail);

    const { userName, emailConfirmation, email } = existingUserByEmail;
    this.eventBus.publish(
      new UserSignUpEvent(userName, emailConfirmation.confirmationToken, email),
    );
  }
}
