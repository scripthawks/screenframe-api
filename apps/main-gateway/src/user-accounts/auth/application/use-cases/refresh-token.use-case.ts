import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginSuccessViewDto } from '../../api/view-dto/login-success.view-dto';
import { JwtService } from '@nestjs/jwt';
import { UserAccountConfig } from '../../../core/config/user-account.config';
import { SessionsRepository } from '../../../sessions/infrastructure/sessions.repository';
import { JwtPayload } from 'apps/main-gateway/src/core/strategies/jwt-access.strategy';

export class RefreshTokenCommand {
  constructor(
    public userId: string,
    public sessionId: string,
  ) {}
}

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenUseCase
  implements ICommandHandler<RefreshTokenCommand, LoginSuccessViewDto>
{
  constructor(
    private readonly userAccountConfig: UserAccountConfig,
    private readonly jwtService: JwtService,
    private readonly sessionsRepository: SessionsRepository,
  ) {}

  async execute(command: RefreshTokenCommand): Promise<LoginSuccessViewDto> {
    const payloadForAccessToken = {
      userId: command.userId,
    };
    const payloadForRefreshToken = {
      userId: command.userId,
      sessionId: command.sessionId,
    };
    const accessToken = await this.jwtService.signAsync(payloadForAccessToken, {
      secret: this.userAccountConfig.ACCESS_TOKEN_SECRET,
      expiresIn: parseInt(this.userAccountConfig.ACCESS_TOKEN_EXPIRATION),
    });
    const refreshToken = await this.jwtService.signAsync(
      payloadForRefreshToken,
      {
        secret: this.userAccountConfig.REFRESH_TOKEN_SECRET,
        expiresIn: parseInt(this.userAccountConfig.REFRESH_TOKEN_EXPIRATION),
      },
    );
    const decodePayload: JwtPayload = this.jwtService.decode(refreshToken);
    const updatedAt = new Date(decodePayload.iat * 1000);
    await this.sessionsRepository.update(command.sessionId, updatedAt);
    return {
      accessToken,
      refreshToken,
    };
  }
}
