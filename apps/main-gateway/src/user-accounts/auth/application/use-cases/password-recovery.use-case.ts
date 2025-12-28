import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { DomainException } from '@app/core/exceptions';
import { CommonExceptionCodes } from '@app/core/exceptions/enums';
import { UuidProvider } from '../../../core/helpers/uuid.provider';
import { PasswordRecoveryInputDto } from '../../api/input-dto/password-recovery.input-dto';
import { RecaptchaService } from '../services/recaptcha.service';
import { PasswordRecovery } from '../../../users/domain/password-recovery.entity';
import { User } from '../../../users/domain/user.entity';
import { PasswordRecoveryRequestedEvent } from '../events/password-recovery-requested.event';

export class PasswordRecoveryCommand {
  constructor(public inputDto: PasswordRecoveryInputDto) {}
}

@CommandHandler(PasswordRecoveryCommand)
export class PasswordRecoveryUseCase
  implements ICommandHandler<PasswordRecoveryCommand, void>
{
  constructor(
    private readonly recaptchaService: RecaptchaService,
    private readonly usersRepository: UsersRepository,
    private readonly uuidProvider: UuidProvider,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: PasswordRecoveryCommand): Promise<void> {
    const { email, recaptchaToken } = command.inputDto;
    await this.recaptchaService.verifyRecaptcha(recaptchaToken);
    const existingUserByEmail: User =
      await this.usersRepository.findByEmailOrFail(email);
    if (!existingUserByEmail.isActive) {
      throw new DomainException(
        CommonExceptionCodes.BAD_REQUEST,
        'User account is deactivated',
        [{ key: 'field', message: 'email' }],
      );
    }

    if (!existingUserByEmail.isVerified) {
      throw new DomainException(
        CommonExceptionCodes.FORBIDDEN,
        'Email not verified',
        [{ key: 'field', message: 'email' }],
      );
    }
    if (existingUserByEmail.passwordRecovery) {
      existingUserByEmail.passwordRecovery.renewToken(this.uuidProvider);
    } else {
      existingUserByEmail.passwordRecovery = PasswordRecovery.create(
        existingUserByEmail.id,
        this.uuidProvider,
      );
    }

    await this.usersRepository.save(existingUserByEmail);

    const { userName, passwordRecovery } = existingUserByEmail;
    this.eventBus.publish(
      new PasswordRecoveryRequestedEvent(
        userName,
        passwordRecovery.recoveryToken,
        email,
      ),
    );
  }
}
