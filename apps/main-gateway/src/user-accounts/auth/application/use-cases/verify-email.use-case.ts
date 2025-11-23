import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { VerifyEmailInputDto } from '../../api/input-dto/verify-email.input-dto';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { DomainException } from '@app/core/exceptions';
import { CommonExceptionCodes } from '@app/core/exceptions/enums';

export class VerifyEmailCommand {
  constructor(public confirmationToken: VerifyEmailInputDto) {}
}

@CommandHandler(VerifyEmailCommand)
export class VerifyEmailUseCase implements ICommandHandler<VerifyEmailCommand> {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(command: VerifyEmailCommand) {
    const verifiedUser = await this.usersRepository.findByConfirmationToken(
      command.confirmationToken.confirmationToken,
    );
    if (!verifiedUser) {
      throw new DomainException(
        CommonExceptionCodes.BAD_REQUEST,
        'Invalid confirmation token',
      );
    }
    if (verifiedUser.isVerified) {
      throw new DomainException(
        CommonExceptionCodes.CONFLICT,
        'Email already confirmed',
      );
    }
    verifiedUser.emailConfirmation.confirm();
    verifiedUser.confirm();
    await this.usersRepository.save(verifiedUser);
  }
}
