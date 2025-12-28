import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { DomainException } from '@app/core/exceptions';
import { CommonExceptionCodes } from '@app/core/exceptions/enums';
import { UuidProvider } from '../../../core/helpers/uuid.provider';
import { PasswordRecovery } from '../../../users/domain/password-recovery.entity';
import { User } from '../../../users/domain/user.entity';
import { PasswordRecoveryRequestedEvent } from '../events/password-recovery-requested.event';
import { PasswordRecoveryResendingInputDto } from '../../api/input-dto/password-recovery-resending.input-dto';

export class PasswordRecoveryResendingCommand {
  constructor(public inputDto: PasswordRecoveryResendingInputDto) {}
}

@CommandHandler(PasswordRecoveryResendingCommand)
export class PasswordRecoveryResendingUseCase
  implements ICommandHandler<PasswordRecoveryResendingCommand, void>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly uuidProvider: UuidProvider,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: PasswordRecoveryResendingCommand): Promise<void> {
    const { email } = command.inputDto;
    const userByEmail: User =
      await this.usersRepository.findByEmailOrFail(email);
    if (!userByEmail.isActive) {
      throw new DomainException(
        CommonExceptionCodes.BAD_REQUEST,
        'User account is deactivated',
        [{ key: 'field', message: 'email' }],
      );
    }

    if (!userByEmail.isVerified) {
      throw new DomainException(
        CommonExceptionCodes.FORBIDDEN,
        'Email not verified',
        [{ key: 'field', message: 'email' }],
      );
    }
    if (userByEmail.passwordRecovery) {
      userByEmail.passwordRecovery.renewToken(this.uuidProvider);
    } else {
      userByEmail.passwordRecovery = PasswordRecovery.create(
        userByEmail.id,
        this.uuidProvider,
      );
    }

    await this.usersRepository.save(userByEmail);

    const { userName, passwordRecovery } = userByEmail;
    this.eventBus.publish(
      new PasswordRecoveryRequestedEvent(
        userName,
        passwordRecovery.recoveryToken,
        email,
      ),
    );
  }
}
