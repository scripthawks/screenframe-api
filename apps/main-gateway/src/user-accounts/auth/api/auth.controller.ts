import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { SignUpCommand } from '../application/use-cases/sign-up.use-case';
import { VerifyEmailCommand } from '../application/use-cases/verify-email.use-case';
import { VerifyEmailInputDto } from './input-dto/verify-email.input-dto';
import { PasswordConfirmationGuard } from './guards/confirmation-password.guard';
import { AcceptedTermsGuard } from './guards/accepted-terms.guard';
import { ResendVerificationInputDto } from './input-dto/resend-verification.input-dto';
import { ResendVerificationCommand } from '../application/use-cases/resend-verification.use-case';
import { ThrottlerGuard } from '@nestjs/throttler';
import { CreateUserInputDto } from '../../users/api/input-dto/create-user.input-dto';
import { LocalAuthGuard } from '../../core/guards/local-auth.guard';
import { UserInfoInputDto } from './input-dto/user-info.input-dto';
import { ResponseAccessTokenDto } from './view-dto/response-access-token.view-dto';
import { LoginSuccessViewDto } from './view-dto/login-success.view-dto';
import { LoginUserCommand } from '../application/use-cases/login-user.use-case';
import { Request as ExpressRequest, Response } from 'express';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';
import { CurrentSessionId, CurrentUserId } from '@app/core/decorators/params';
import { MeViewDto } from './view-dto/me.view-dto';
import { GetInfoAboutCurrentUserQuery } from '../application/queries/get-info-about-current-user.query';
import { RefreshTokenGuard } from '../../core/guards/refresh-token.guard';
import { RefreshTokenCommand } from '../application/use-cases/refresh-token.use-case';
import { LogoutCommand } from '../application/use-cases/logout.use-case';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../../users/domain/user.entity';
import { PasswordRecoveryInputDto } from './input-dto/password-recovery.input-dto';
import { PasswordRecoveryCommand } from '../application/use-cases/password-recovery.use-case';
import { CheckRecoveryTokenInputDto } from './input-dto/check-recovery-token.input-dto';
import { CheckRecoveryTokenCommand } from '../application/use-cases/check-recovery-token.use-case';
import { PasswordRecoveryResendingInputDto } from './input-dto/password-recovery-resending.input-dto';
import { PasswordRecoveryResendingCommand } from '../application/use-cases/password-recovery-resending.use-case';
import { NewPasswordInputDto } from './input-dto/new-password.input-dto';
import { NewPasswordCommand } from '../application/use-cases/new-password.use-case';
import {
  ApiSigningUp,
  ApiVerifyEmail,
  ApiResendVerification,
  ApiLogin,
  ApiRefreshToken,
  ApiLogout,
  ApiGetMe,
  ApiPasswordRecovery,
  ApiCheckRecoveryToken,
  ApiPasswordRecoveryResending,
  ApiNewPassword,
} from '@app/core/decorators/swagger/auth.swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('signup')
  @UseGuards(PasswordConfirmationGuard, AcceptedTermsGuard, ThrottlerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiSigningUp()
  async signUp(@Body() userDto: CreateUserInputDto): Promise<void> {
    await this.commandBus.execute(new SignUpCommand(userDto));
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiVerifyEmail()
  async verifyEmail(
    @Body() verifyEmailInputDto: VerifyEmailInputDto,
  ): Promise<void> {
    await this.commandBus.execute(new VerifyEmailCommand(verifyEmailInputDto));
  }

  @Post('resend-verification')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResendVerification()
  async resendVerification(
    @Body() resendVerificationInputDto: ResendVerificationInputDto,
  ): Promise<void> {
    await this.commandBus.execute(
      new ResendVerificationCommand(resendVerificationInputDto),
    );
  }

  @Post('login')
  @UseGuards(LocalAuthGuard, ThrottlerGuard)
  @HttpCode(HttpStatus.OK)
  @ApiLogin()
  async login(
    @Req() req: ExpressRequest,
    @Res({ passthrough: true }) response: Response,
    @Req() { user }: UserInfoInputDto,
  ): Promise<ResponseAccessTokenDto> {
    const ip = req.ip;
    const deviceName = req.headers['user-agent'];
    const result: LoginSuccessViewDto = await this.commandBus.execute(
      new LoginUserCommand(user, ip, deviceName),
    );

    const { accessToken, refreshToken } = result;

    this.setRefreshTokenCookie(refreshToken, response);

    return new ResponseAccessTokenDto(accessToken);
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard, ThrottlerGuard)
  @ApiRefreshToken()
  async refreshToken(
    @Req() { user, sessionId }: UserInfoInputDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<ResponseAccessTokenDto> {
    const result: LoginSuccessViewDto = await this.commandBus.execute(
      new RefreshTokenCommand(user, sessionId),
    );

    const { accessToken, refreshToken } = result;

    this.setRefreshTokenCookie(refreshToken, response);

    return new ResponseAccessTokenDto(accessToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RefreshTokenGuard)
  @ApiLogout()
  async logout(
    @CurrentSessionId() { sessionId }: UserInfoInputDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.commandBus.execute(new LogoutCommand(sessionId));
    response.clearCookie('refreshToken');
    return;
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiGetMe()
  async get(@CurrentUserId() currentUserId: string): Promise<MeViewDto> {
    return await this.queryBus.execute(
      new GetInfoAboutCurrentUserQuery(currentUserId),
    );
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/redirect')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(
    @Req() req: ExpressRequest,
    @Res() response: Response,
  ) {
    return this.handleOAuthRedirect(req, response);
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubAuth() {}

  @Get('github/redirect')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('github'))
  async githubAuthRedirect(
    @Req() req: ExpressRequest,
    @Res() response: Response,
  ) {
    return this.handleOAuthRedirect(req, response);
  }

  private async handleOAuthRedirect(req: ExpressRequest, response: Response) {
    const user = req.user as User;

    const result: LoginSuccessViewDto = await this.commandBus.execute(
      new LoginUserCommand(user.id, req.ip, req.headers['user-agent']),
    );

    this.setRefreshTokenCookie(result.refreshToken, response);
    response.redirect('http://localhost:5173/');
  }

  private setRefreshTokenCookie(refreshToken: string, response: Response) {
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  @Post('password-recovery')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(ThrottlerGuard)
  @ApiPasswordRecovery()
  async passwordRecovery(
    @Body() passwordRecoveryInputDto: PasswordRecoveryInputDto,
  ): Promise<void> {
    await this.commandBus.execute(
      new PasswordRecoveryCommand(passwordRecoveryInputDto),
    );
  }

  @Post('check-recovery-token')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(ThrottlerGuard)
  @ApiCheckRecoveryToken()
  async checkRecoveryToken(
    @Body() checkRecoveryTokenInputDto: CheckRecoveryTokenInputDto,
  ): Promise<void> {
    await this.commandBus.execute(
      new CheckRecoveryTokenCommand(checkRecoveryTokenInputDto),
    );
  }

  @Post('password-recovery-resending')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(ThrottlerGuard)
  @ApiPasswordRecoveryResending()
  async passwordRecoveryResending(
    @Body()
    passwordRecoveryResendingInputDto: PasswordRecoveryResendingInputDto,
  ): Promise<void> {
    await this.commandBus.execute(
      new PasswordRecoveryResendingCommand(passwordRecoveryResendingInputDto),
    );
  }

  @Post('new-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(ThrottlerGuard)
  @ApiNewPassword()
  async newPassword(
    @Body()
    newPasswordInputDto: NewPasswordInputDto,
  ): Promise<void> {
    await this.commandBus.execute(new NewPasswordCommand(newPasswordInputDto));
  }
}
