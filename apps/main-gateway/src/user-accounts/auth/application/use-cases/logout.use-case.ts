import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { SessionsRepository } from '../../../sessions/infrastructure/sessions.repository';

export class LogoutCommand {
  constructor(public sessionId: string) {}
}

@CommandHandler(LogoutCommand)
export class LogoutUseCase
  implements ICommandHandler<LogoutCommand, boolean | null>
{
  constructor(private readonly sessionsRepository: SessionsRepository) {}

  async execute(command: LogoutCommand): Promise<boolean | null> {
    const foundDevice = await this.sessionsRepository.findById(
      command.sessionId,
    );
    if (!foundDevice) {
      throw new NotFoundException('The device was not found');
    }
    return await this.sessionsRepository.deactivate(foundDevice);
  }
}
