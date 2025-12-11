import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../../auth/application/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'loginOrEmail',
    });
  }

  async validate(
    userNameOrEmail: string,
    password: string,
  ): Promise<string | null> {
    const userId = await this.authService.validateUser({
      userNameOrEmail,
      password,
    });
    if (!userId) {
      throw new UnauthorizedException();
    }
    return userId;
  }
}
