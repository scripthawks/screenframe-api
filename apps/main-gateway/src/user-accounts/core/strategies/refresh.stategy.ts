import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { UserAccountConfig } from '../config/user-account.config';
import { SessionsRepository } from '../../sessions/infrastructure/sessions.repository';
import { JwtPayload } from '../../../core/strategies/jwt-access.strategy';
import { DomainException } from '@app/core/exceptions';
import { CommonExceptionCodes } from '@app/core/exceptions/enums';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    userAccountConfig: UserAccountConfig,
    private readonly sessionsRepository: SessionsRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const request = req as unknown as {
            cookies?: { refreshToken?: string };
          };

          return request.cookies?.refreshToken || null;
        },
      ]),
      secretOrKey: userAccountConfig.REFRESH_TOKEN_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const session = await this.sessionsRepository.findByUserAndSessionId(
      payload.userId,
      payload.sessionId,
    );

    if (!session) {
      throw new DomainException(
        CommonExceptionCodes.UNAUTHORIZED,
        'Session not found',
      );
    }
    return payload;
  }
}
