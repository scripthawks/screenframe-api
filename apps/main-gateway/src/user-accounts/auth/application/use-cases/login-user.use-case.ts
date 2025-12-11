import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserAccountConfig } from '../../../core/config/user-account.config';
import { JwtService } from '@nestjs/jwt';
import { UuidProvider } from '../../../core/helpers/uuid.provider';
import { Injectable } from '@nestjs/common';
import { LoginSuccessViewDto } from '../../api/view-dto/login-success.view-dto';

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
  ) {}

  async execute(command: LoginUserCommand): Promise<LoginSuccessViewDto> {
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

    return {
      accessToken,
      refreshToken,
    };
  }
}
