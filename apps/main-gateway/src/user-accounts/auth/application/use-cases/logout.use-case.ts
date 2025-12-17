import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { SessionRepository } from '../../../sessions/infrastructure/session.repository';

export class LogoutCommand {
  constructor(public sessionId: string) {}
}

@CommandHandler(LogoutCommand)
export class LogoutUseCase
  implements ICommandHandler<LogoutCommand, boolean | null>
{
  constructor(private readonly sessionRepository: SessionRepository) {}

  async execute(command: LogoutCommand): Promise<boolean | null> {
    const foundDevice = await this.sessionRepository.findById(
      command.sessionId,
    );
    if (!foundDevice) {
      throw new NotFoundException('The device was not found');
    }
    return await this.sessionRepository.deactivate(foundDevice);
  }
}
