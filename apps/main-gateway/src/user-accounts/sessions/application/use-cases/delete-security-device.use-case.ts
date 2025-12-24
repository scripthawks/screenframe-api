import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { SessionsRepository } from '../../infrastructure/sessions.repository';

export class DeleteSessionsCommand {
  constructor(
    public currentUserId: string,
    public deviceId: string,
  ) {}
}

@CommandHandler(DeleteSessionsCommand)
export class DeleteSessionUseCase
  implements ICommandHandler<DeleteSessionsCommand, boolean | null>
{
  constructor(private readonly sessionsRepository: SessionsRepository) {}

  async execute(command: DeleteSessionsCommand): Promise<boolean | null> {
    const foundDevice = await this.sessionsRepository.findById(
      command.deviceId,
    );
    if (!foundDevice) {
      throw new NotFoundException('The device was not found');
    }
    if (command.currentUserId !== foundDevice.user.id) {
      throw new ForbiddenException([
        {
          field: 'device',
          message: "You cannot delete another user's device ID",
        },
      ]);
    }
    return await this.sessionsRepository.deleteById(foundDevice);
  }
}
