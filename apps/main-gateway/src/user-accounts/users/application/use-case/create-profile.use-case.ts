import { CreateProfileDto } from '../dto/create-profile.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/users.repository';
import { DomainException } from '@app/core/exceptions';
import { CommonExceptionCodes } from '@app/core/exceptions/enums';
import { Profile } from '../../domain/profile.entity';
import { FilesClientService } from 'apps/main-gateway/src/clients/files/file-client.service';
import { DataSource } from 'typeorm';
import { UsersService } from '../users.service';
import { User } from '../../domain/user.entity';

export class CreateUserProfileCommand {
  constructor(
    public userId: string,
    public dto: CreateProfileDto,
    public file: Express.Multer.File,
  ) {}
}

@CommandHandler(CreateUserProfileCommand)
export class CreateUserProfileUseCase
  implements ICommandHandler<CreateUserProfileCommand>
{
  constructor(
    private usersRepository: UsersRepository,
    private filesClientService: FilesClientService,
    private dataSource: DataSource,
    private usersService: UsersService,
  ) {}

  async execute({
    userId,
    dto,
    file,
  }: CreateUserProfileCommand): Promise<void> {
    const user = await this.loadUserOrFail(userId);

    if (dto.userName) {
      await this.usersService.validateUserName(userId, dto.userName);
    }

    const uploadedAvatar = file
      ? await this.filesClientService.sendAvatar(file)
      : null;

    try {
      if (dto.userName) user.userName = dto.userName;

      user.profile = Profile.create(dto, user);
      if (uploadedAvatar) {
        user.profile.updateAvatar(uploadedAvatar.url, uploadedAvatar.publicId);
      }

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
  }

  private async loadUserOrFail(userId: string): Promise<User> {
    const user = await this.usersRepository.findByIdWithProfile(userId);
    if (!user) {
      throw new DomainException(
        CommonExceptionCodes.NOT_FOUND,
        'User not found or deleted',
      );
    }
    if (user.profile) {
      throw new DomainException(
        CommonExceptionCodes.NOT_FOUND,
        'Profile already created',
      );
    }
    return user;
  }
}
