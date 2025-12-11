import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ArgonHasher } from '../../../core/adapters/hash/argon-hasher.adapter';
import { CreateUserInputDto } from '../../../users/api/input-dto/create-user.input-dto';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { User } from '../../../users/domain/user.entity';
import { UuidProvider } from '../../../core/helpers/uuid.provider';
import { UserSignUpEvent } from '../events/sign-up-user.event';
import { UserAccountConfig } from '../../../core/config/user-account.config';
import { DomainException } from '@app/core/exceptions';
import { CommonExceptionCodes } from '@app/core/exceptions/enums';

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
    private readonly userAccountConfig: UserAccountConfig,
  ) {}

  async execute({ userDto: { userName, password, email } }: SignUpCommand) {
    const [userByUserName, userByEmail] = await Promise.all([
      this.userRepo.findByUserName(userName),
      this.userRepo.findByEmail(email),
    ]);

    const isUserExist = userByUserName || userByEmail;

    if (isUserExist) {
      if (isUserExist.userName === userName || isUserExist.email === email) {
        throw new DomainException(
          CommonExceptionCodes.CONFLICT,
          'User already exists',
        );
      }
    }

    await this.createUser(userName, password, email);
  }

  private async createUser(userName: string, password: string, email: string) {
    const passwordHash = await this.hashAdapter.generateHash(password);

    const user = User.createWithConfirmation(
      { userName, email, password: passwordHash },
      this.uuidProvider,
      this.userAccountConfig.CONFIRMATION_TOKEN_EXPIRATION,
    );

    await this.userRepo.save(user);

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
