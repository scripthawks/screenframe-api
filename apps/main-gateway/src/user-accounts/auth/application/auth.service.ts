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
    const { email, password } = loginInput;
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new DomainException(
        CommonExceptionCodes.BAD_REQUEST,
        'The email or password are incorrect. Try again please',
      );
    }
    const isPasswordValid = await this.bcryptService.checkPassword(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new DomainException(
        CommonExceptionCodes.BAD_REQUEST,
        'The email or password are incorrect. Try again please',
      );
    }

    if (!user.isVerified) {
      throw new DomainException(
        CommonExceptionCodes.UNAUTHORIZED,
        'Email not verified. Please sign in again to receive a new verification link.',
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
