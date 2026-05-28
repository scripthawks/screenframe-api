import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/users.repository';
import { DomainException } from '@app/core/exceptions';
import { CommonExceptionCodes } from '@app/core/exceptions/enums';
import { FilesClientService } from 'apps/main-gateway/src/clients/files/file-client.service';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { User } from '../../domain/user.entity';
import { UsersService } from '../users.service';

export class UpdateUserProfileCommand {
  constructor(
    public userId: string,
    public dto: UpdateProfileDto,
    public isHasChanges: boolean,
    public file: Express.Multer.File,
  ) {}
}

@CommandHandler(UpdateUserProfileCommand)
export class UpdateUserProfileUseCase
  implements ICommandHandler<UpdateUserProfileCommand>
{
  constructor(
    private usersRepository: UsersRepository,
    private filesClientService: FilesClientService,
    private usersService: UsersService,
  ) {}

  async execute({
    userId,
    dto,
    isHasChanges,
    file,
  }: UpdateUserProfileCommand): Promise<void> {
    const user = await this.loadUserOrFail(userId);

    if (dto.userName)
      await this.usersService.validateUserName(userId, dto.userName);

    const uploadedAvatar = file
      ? await this.filesClientService.sendAvatar(file)
      : null;
    const oldAvatarPublicId = user.profile.avatarPublicId;

    try {
      if (isHasChanges) this.applyContentChanges(user, dto);
      if (uploadedAvatar)
        user.profile.updateAvatar(uploadedAvatar.url, uploadedAvatar.publicId);
      await this.usersRepository.save(user);
    } catch {
      if (uploadedAvatar) {
        await this.filesClientService.deleteAvatar(uploadedAvatar.publicId);
      }
      throw new DomainException(
        CommonExceptionCodes.INTERNAL_SERVER_ERROR,
        'Failed to save user or profile, try again later',
      );
    }

    if (oldAvatarPublicId && uploadedAvatar) {
      await this.filesClientService.deleteAvatar(oldAvatarPublicId);
    }
  }

  private async loadUserOrFail(userId: string): Promise<User> {
    const user = await this.usersRepository.findByIdWithProfile(userId);
    if (!user) {
      throw new DomainException(
        CommonExceptionCodes.NOT_FOUND,
        'User not found or deleted',
      );
    }
    if (!user.profile) {
      throw new DomainException(
        CommonExceptionCodes.NOT_FOUND,
        'Should create profile first',
      );
    }
    return user;
  }

  private applyContentChanges(user: User, dto: UpdateProfileDto): void {
    const { userName, ...rest } = dto;
    if (userName) user.userName = userName;
    user.profile.update(rest);
  }
}
