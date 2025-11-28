import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ArgonHasher } from '../../../core/adapters/hash/argon-hasher.adapter';
import { CreateUserInputDto } from '../../../users/api/input-dto/create-user.input-dto';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { User } from '../../../users/domain/user.entity';
import { UuidProvider } from '../../../core/helpers/uuid.provider';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { UserSignUpEvent } from '../events/sign-up-user.event';

export class SignUpCommand {
  constructor(public userDto: CreateUserInputDto) {}
}

@CommandHandler(SignUpCommand)
export class SignUpUseCase implements ICommandHandler<SignUpCommand> {
  constructor(
    private readonly userRepo: UsersRepository,
    private readonly hashAdapter: ArgonHasher,
    private readonly uuidProvider: UuidProvider,
    private readonly eventBus: EventBus,
  ) {}

  async execute({ userDto: { userName, password, email } }: SignUpCommand) {
    const isUserExist = await this.userRepo.findByUserNameOrEmail(
      userName,
      email,
    );

    if (isUserExist) {
      if (isUserExist.userName === userName || isUserExist.email === email) {
        throw new ConflictException('User already exists');
      }
    }

    try {
      await this.createUser(userName, password, email);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Validation failed');
    }
  }

  private async createUser(userName: string, password: string, email: string) {
    const passwordHash = await this.hashAdapter.generateHash(password);

    const user = User.createWithConfirmation(
      { userName, email, password: passwordHash },
      this.uuidProvider,
      60 * 60 * 1000, // expire in 1 hours confirmToken
    );

    await this.userRepo.create(user);

    this.createUserEvent(
      userName,
      user.emailConfirmation.confirmationToken,
      email,
    );

    return;
  }

  private createUserEvent(
    userName: string,
    emailConfirmation: string,
    email: string,
  ) {
    const event = new UserSignUpEvent(userName, emailConfirmation, email);
    this.eventBus.publish(event);
  }
}
