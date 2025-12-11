import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from '../../users/infrastructure/users.repository';
import { ArgonHasher } from '../../core/adapters/hash/argon-hasher.adapter';
import { LoginInputDto } from '../api/input-dto/login.input-dto';

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
      throw new UnauthorizedException('User not found');
    }
    const isPasswordValid = await this.bcryptService.checkPassword(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException('Please verify your email first');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is disabled');
    }

    return user.id.toString();
  }
}
