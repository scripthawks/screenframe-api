import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionsRepository } from '../../infrastructure/sessions.repository';

export class DeleteAllSessionsExcludingCurrentCommand {
  constructor(
    public currentUserId: string,
    public currentSessionId: string,
  ) {}
}

@CommandHandler(DeleteAllSessionsExcludingCurrentCommand)
export class DeleteAllSessionsExcludingCurrentUseCase
  implements
    ICommandHandler<DeleteAllSessionsExcludingCurrentCommand, boolean | null>
{
  constructor(private readonly sessionsRepository: SessionsRepository) {}

  async execute(
    command: DeleteAllSessionsExcludingCurrentCommand,
  ): Promise<boolean | null> {
    return await this.sessionsRepository.deleteExcludingCurrent(
      command.currentUserId,
      command.currentSessionId,
    );
  }
}
