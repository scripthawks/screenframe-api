import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../users/infrastructure/users.repository';
import { ArgonHasher } from '../../core/adapters/hash/argon-hasher.adapter';
import { LoginInputDto } from '../api/input-dto/login.input-dto';
import { DomainException } from '@app/core/exceptions';
import { CommonExceptionCodes } from '@app/core/exceptions/enums';
import { OAuthProfileDto } from '../api/input-dto/oauth-profile.input-dto';
import { ProvidersRepository } from '../../users/infrastructure/providers.repository';
import { nanoid } from 'nanoid';

@Injectable()
export class AuthService {
  constructor(
    private readonly argonHasher: ArgonHasher,
    private readonly usersRepository: UsersRepository,
    private readonly providersRepository: ProvidersRepository,
  ) {}

  async validateUser(loginInput: LoginInputDto): Promise<string> {
    const { email, password } = loginInput;
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new DomainException(
        CommonExceptionCodes.BAD_REQUEST,
        'The email or password are incorrect. Try again please',
      );
    }
    const isPasswordValid = await this.argonHasher.checkPassword(
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

  async validateOAuth(profile: OAuthProfileDto, provider: 'google' | 'github') {
    const providerId = profile.id;
    const email = profile.emails?.[0]?.value;
    if (!email) {
      throw new DomainException(
        CommonExceptionCodes.BAD_REQUEST,
        'Email not provided by OAuth provider',
      );
    }
    const account =
      await this.providersRepository.getUserAuthAccountByProviderAndProviderId(
        provider,
        providerId,
      );
    if (account) return account.user;

    let user = await this.usersRepository.findByEmail(email);

    if (!user) {
      let baseUsername: string;

      if (provider === 'github') {
        baseUsername = profile.username || 'github-user';
      } else {
        baseUsername = profile.displayName || 'user';
      }

      const nanoidValue = nanoid(6);
      const username = `${baseUsername}-${nanoidValue}`;
      try {
        user = await this.usersRepository.createUserOAuth(username, email);
        await this.usersRepository.updateEmailConfirmationStatus(user.id);
      } catch {
        throw new DomainException(
          CommonExceptionCodes.UNAUTHORIZED,
          'User with this email or username already exists',
        );
      }
    }

    await this.providersRepository.createAuthAccountForUser(
      user.id,
      provider,
      providerId,
    );

    return user;
  }
}
