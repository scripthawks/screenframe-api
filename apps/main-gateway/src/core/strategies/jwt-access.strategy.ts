import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserAccountConfig } from '../../user-accounts/core/config/user-account.config';

export interface JwtAccessPayload {
  userId: string;
  iat: number;
  exp: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(userAccountConfig: UserAccountConfig) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: userAccountConfig.ACCESS_TOKEN_SECRET,
    });
  }

  validate(payload: JwtAccessPayload): string {
    const userId = payload.userId;
    return userId;
  }
}
