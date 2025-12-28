import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { NewPasswordInputDto } from '../../api/input-dto/new-password.input-dto';
import { DomainException } from '@app/core/exceptions';
import { CommonExceptionCodes } from '@app/core/exceptions/enums';
import { ArgonHasher } from '../../../core/adapters/hash/argon-hasher.adapter';
import { SessionRepository } from '../../../sessions/infrastructure/session.repository';
import { NewPasswordEvent } from '../events/new-password.event';

export class NewPasswordCommand {
  constructor(public inputDto: NewPasswordInputDto) {}
}

@CommandHandler(NewPasswordCommand)
export class NewPasswordUseCase
  implements ICommandHandler<NewPasswordCommand, void>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly argonHasher: ArgonHasher,
    private readonly sessionRepository: SessionRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: NewPasswordCommand): Promise<void> {
    const { password, passwordConfirmation, recoveryToken } = command.inputDto;
    if (passwordConfirmation !== password) {
      throw new DomainException(
        CommonExceptionCodes.BAD_REQUEST,
        'Passwords must match',
        [{ key: 'field', message: 'passwordConfirmation' }],
      );
    }
    const userByRecoveryToken =
      await this.usersRepository.findByRecoveryTokenOrFail(recoveryToken);

    userByRecoveryToken.passwordRecovery.confirm();

    const passwordHash = await this.argonHasher.generateHash(password);

    userByRecoveryToken.update({ password: passwordHash });

    await this.deactivateAllUserSessions(userByRecoveryToken.id);

    await this.usersRepository.save(userByRecoveryToken);
    const { userName, email } = userByRecoveryToken;
    this.eventBus.publish(new NewPasswordEvent(userName, email));
  }

  private async deactivateAllUserSessions(userId: string): Promise<void> {
    const sessions =
      await this.sessionRepository.findActiveSessionsByUserId(userId);
    for (const session of sessions) {
      session.deactivate();
      await this.sessionRepository.save(session);
    }
  }
}
