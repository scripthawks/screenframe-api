import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../users/infrastructure/users.repository';
import { ArgonHasher } from '../../core/adapters/hash/argon-hasher.adapter';
import { LoginInputDto } from '../api/input-dto/login.input-dto';
import { DomainException } from '@app/core/exceptions';
import { CommonExceptionCodes } from '@app/core/exceptions/enums';

@Injectable()
export class AuthService {
  constructor(
    private readonly bcryptService: ArgonHasher,
    private readonly usersRepository: UsersRepository,
  ) {}

  async validateUser(loginInput: LoginInputDto): Promise<string | null> {
    const { userNameOrEmail, password } = loginInput;
    const user =
      await this.usersRepository.findByUserNameOrEmail(userNameOrEmail);
    if (!user) {
      throw new DomainException(
        CommonExceptionCodes.BAD_REQUEST,
        'Invalid username or email',
      );
    }
    const isPasswordValid = await this.bcryptService.checkPassword(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new DomainException(
        CommonExceptionCodes.BAD_REQUEST,
        'Invalid password',
      );
    }

    if (!user.isVerified) {
      throw new DomainException(
        CommonExceptionCodes.UNAUTHORIZED,
        'Please verify your email first',
      );
    }

    if (!user.isActive) {
      throw new DomainException(
        CommonExceptionCodes.UNAUTHORIZED,
        'Account is disabled',
      );
    }

    return user.id.toString();
  }
}
