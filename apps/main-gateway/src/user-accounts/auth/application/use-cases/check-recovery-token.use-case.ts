import { CheckRecoveryTokenInputDto } from '../../api/input-dto/check-recovery-token.input-dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { DomainException } from '@app/core/exceptions';
import { CommonExceptionCodes } from '@app/core/exceptions/enums';

export class CheckRecoveryTokenCommand {
  constructor(public readonly inputDto: CheckRecoveryTokenInputDto) {}
}

@CommandHandler(CheckRecoveryTokenCommand)
export class CheckRecoveryTokenUseCase
  implements ICommandHandler<CheckRecoveryTokenCommand, void>
{
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(command: CheckRecoveryTokenCommand): Promise<void> {
    const { recoveryToken } = command.inputDto;
    const userByRecoveryToken =
      await this.usersRepository.findByRecoveryTokenOrFail(recoveryToken);
    const passwordRecovery = userByRecoveryToken.passwordRecovery;
    if (passwordRecovery.isUsed) {
      throw new DomainException(
        CommonExceptionCodes.BAD_REQUEST,
        'Recovery token already used',
      );
    }
    if (passwordRecovery.expiresAt < new Date()) {
      throw new DomainException(
        CommonExceptionCodes.BAD_REQUEST,
        'Recovery token expired',
      );
    }
  }
}
