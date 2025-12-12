import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserAccountConfig } from '../../../core/config/user-account.config';
import { JwtService } from '@nestjs/jwt';
import { UuidProvider } from '../../../core/helpers/uuid.provider';
import { Injectable } from '@nestjs/common';
import { LoginSuccessViewDto } from '../../api/view-dto/login-success.view-dto';
import { SessionRepository } from '../../../sessions/infrastructure/session.repository';
import { Session } from '../../../users/domain/session.entity';
import { CreateSessionDto } from '../../../users/domain/dto/session/create-session.dto';
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
    if (!command.ip) {
      throw new DomainException(
        CommonExceptionCodes.UNAUTHORIZED,
        'IP address is required',
      );
    }

    if (!command.deviceName) {
      throw new DomainException(
        CommonExceptionCodes.UNAUTHORIZED,
        'Device name is required',
      );
    }

    const payloadForAccessToken = {
      userId: command.userId,
    };
    const payloadForRefreshToken = {
      userId: command.userId,
      deviceId: this.uuidProvider.generate(),
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

    const session = await this.sessionRepository.findByUserAndDeviceName(
      command.userId,
      command.deviceName,
    );

    if (session && session.isActive) {
      await this.updateSession(
        session,
        command.ip,
        new Date(decodePayload.exp * 1000),
      );
    } else {
      await this.createSession(
        command.userId,
        command.deviceName,
        command.ip,
        decodePayload.exp,
      );
    }

    return {
      accessToken,
      refreshToken,
    };
  }

  private async createSession(
    userId: string,
    deviceName: string,
    ip: string,
    expiresAt: number,
  ): Promise<void> {
    const createSessionDto: CreateSessionDto = {
      userId,
      deviceName,
      ipAddress: ip,
      expiresAt,
    };
    const createdSession = Session.create(createSessionDto);
    await this.sessionRepository.save(createdSession);
  }

  private async updateSession(
    session: Session,
    ip: string,
    expiresAt: Date,
  ): Promise<void> {
    session.update({
      ipAddress: ip,
      expiresAt,
    });
    await this.sessionRepository.save(session);
  }
}
