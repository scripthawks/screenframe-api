import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserAccountConfig } from '../../../core/config/user-account.config';
import { JwtService } from '@nestjs/jwt';
import { UuidProvider } from '../../../core/helpers/uuid.provider';
import { Injectable } from '@nestjs/common';
import { LoginSuccessViewDto } from '../../api/view-dto/login-success.view-dto';
import { SessionRepository } from '../../../sessions/infrastructure/session.repository';
import { Session } from '../../../sessions/domain/session.entity';
import { CreateSessionDto } from '../../../sessions/domain/dto/create-session.dto';
import { JwtPayload } from 'apps/main-gateway/src/core/strategies/jwt-access.strategy';
import { CommonExceptionCodes } from '@app/core/exceptions/enums';
import { DomainException } from '@app/core/exceptions';

export class LoginUserCommand {
  constructor(
    public userId: string,
    public ip?: string,
    public deviceName?: string,
  ) {}
}
@Injectable()
@CommandHandler(LoginUserCommand)
export class LoginUserUseCase
  implements ICommandHandler<LoginUserCommand, LoginSuccessViewDto>
{
  constructor(
    private readonly userAccountConfig: UserAccountConfig,
    private readonly jwtService: JwtService,
    private readonly uuidProvider: UuidProvider,
    private readonly sessionRepository: SessionRepository,
  ) {}

  async execute(command: LoginUserCommand): Promise<LoginSuccessViewDto> {
    if (!command.ip || !command.deviceName) {
      throw new DomainException(
        CommonExceptionCodes.UNAUTHORIZED,
        'Authentication failed',
      );
    }

    const payloadForAccessToken = {
      userId: command.userId,
    };
    const payloadForRefreshToken = {
      userId: command.userId,
      sessionId: this.uuidProvider.generate(),
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

    await this.createSession(
      command.userId,
      payloadForRefreshToken.sessionId,
      command.deviceName,
      command.ip,
      decodePayload.exp,
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  private async createSession(
    userId: string,
    sessionId: string,
    deviceName: string,
    ip: string,
    expiresAt: number,
  ): Promise<void> {
    const activeSessions =
      await this.sessionRepository.countUserSessions(userId);
    if (activeSessions >= this.userAccountConfig.MAX_SESSIONS_PER_USER) {
      await this.sessionRepository.deactivateOldestUserSession(userId);
    }

    const createSessionDto: CreateSessionDto = {
      userId,
      sessionId,
      deviceName,
      ipAddress: ip,
      expiresAt,
    };
    const createdSession = Session.create(createSessionDto);
    await this.sessionRepository.save(createdSession);
  }
}
