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
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { SignUpCommand } from '../application/use-cases/sign-up.use-case';
import { VerifyEmailCommand } from '../application/use-cases/verify-email.use-case';
import { VerifyEmailInputDto } from './input-dto/verify-email.input-dto';
import {
  ApiBadRequestConfiguredResponse,
  ApiConflictConfiguredResponse,
  ApiForbiddenConfiguredResponse,
  ApiNoContentConfiguredResponse,
  ApiTooManyRequestsConfiguredResponse,
  ApiUnauthorizedConfiguredResponse,
} from '@app/core/decorators/swagger';
import { PasswordConfirmationGuard } from './guards/confirmation-password.guard';
import { AcceptedTermsGuard } from './guards/accepted-terms.guard';
import { ResendVerificationInputDto } from './input-dto/resend-verification.input-dto';
import { ResendVerificationCommand } from '../application/use-cases/resend-verification.use-case';
import { ThrottlerGuard } from '@nestjs/throttler';
import { SignUpUserInputDto } from './input-dto/sign-up.input-dto';
import { CreateUserInputDto } from '../../users/api/input-dto/create-user.input-dto';
import { LocalAuthGuard } from '../../core/guards/local-auth.guard';
import { LoginInputDto } from './input-dto/login.input-dto';
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
import { PasswordRecoveryInputDto } from './input-dto/password-recovery.input-dto';
import { PasswordRecoveryCommand } from '../application/use-cases/password-recovery.use-case';
import { CheckRecoveryTokenInputDto } from './input-dto/check-recovery-token.input-dto';
import { CheckRecoveryTokenCommand } from '../application/use-cases/check-recovery-token.use-case';
import { PasswordRecoveryResendingInputDto } from './input-dto/password-recovery-resending.input-dto';
import { PasswordRecoveryResendingCommand } from '../application/use-cases/password-recovery-resending.use-case';
import { NewPasswordInputDto } from './input-dto/new-password.input-dto';
import { NewPasswordCommand } from '../application/use-cases/new-password.use-case';

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
  @ApiOperation({
    summary:
      'Sign up new user. Email confirmation required - verification link will be sent to the provided email.',
  })
  @ApiNoContentConfiguredResponse(
    'An email with a verification token has been sent to the specified email address',
  )
  @ApiConflictConfiguredResponse('User already exists')
  @ApiBadRequestConfiguredResponse()
  @ApiBody({ type: SignUpUserInputDto })
  async signUp(@Body() userDto: CreateUserInputDto): Promise<void> {
    await this.commandBus.execute(new SignUpCommand(userDto));
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Verify email' })
  @ApiNoContentConfiguredResponse('Email was verified. Account was activated')
  @ApiBadRequestConfiguredResponse()
  @ApiConflictConfiguredResponse('Email already confirmed')
  async verifyEmail(
    @Body() verifyEmailInputDto: VerifyEmailInputDto,
  ): Promise<void> {
    await this.commandBus.execute(new VerifyEmailCommand(verifyEmailInputDto));
  }

  @Post('resend-verification')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Resend verification if the user exists' })
  @ApiNoContentConfiguredResponse(
    'An email with a verification token has been sent to the specified email address',
  )
  @ApiBadRequestConfiguredResponse()
  @ApiConflictConfiguredResponse('Email already confirmed')
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
  @ApiOperation({
    summary:
      'Authenticates user with email and password. Returns access token and sets refresh token in HTTP-only cookie.',
  })
  @ApiBadRequestConfiguredResponse(
    'Invalid email format or password requirements not met',
  )
  @ApiUnauthorizedConfiguredResponse('Email not verified.')
  @ApiBody({ type: LoginInputDto })
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

    this.setCookieInResponse(refreshToken, response);

    return new ResponseAccessTokenDto(accessToken);
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard, ThrottlerGuard)
  @ApiOperation({
    summary:
      'Refresh access token. Issues new access and refresh tokens using valid refresh token from HTTP-only cookie. Invalidates previous refresh token.',
  })
  @ApiBadRequestConfiguredResponse(
    'Invalid refresh token format or missing cookie',
  )
  @ApiUnauthorizedConfiguredResponse(
    'Invalid, expired or revoked refresh token',
  )
  async refreshToken(
    @Req() { user, sessionId }: UserInfoInputDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<ResponseAccessTokenDto> {
    const result: LoginSuccessViewDto = await this.commandBus.execute(
      new RefreshTokenCommand(user, sessionId),
    );

    const { accessToken, refreshToken } = result;

    this.setCookieInResponse(refreshToken, response);

    return new ResponseAccessTokenDto(accessToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RefreshTokenGuard)
  @ApiNoContentConfiguredResponse()
  @ApiUnauthorizedConfiguredResponse()
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
  @ApiOperation({
    summary:
      'Returns detailed information about the currently authenticated user. Requires valid JWT token.',
  })
  @ApiBearerAuth()
  @ApiUnauthorizedConfiguredResponse(
    'JWT refreshToken inside cookie is missing, expired or incorrect',
  )
  async get(@CurrentUserId() currentUserId: string): Promise<MeViewDto> {
    return await this.queryBus.execute(
      new GetInfoAboutCurrentUserQuery(currentUserId),
    );
  }

  private setCookieInResponse(refreshToken: string, response: Response) {
    return response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  @Post('password-recovery')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(ThrottlerGuard)
  @ApiOperation({
    summary:
      'Password recovery. Email with confirmation code will be send to passed email address',
  })
  @ApiNoContentConfiguredResponse(
    'Password recovery link has been sent to the specified email',
  )
  @ApiBadRequestConfiguredResponse(
    'Invalid email or reCAPTCHA verification failed',
  )
  @ApiForbiddenConfiguredResponse('Email not verified')
  @ApiTooManyRequestsConfiguredResponse(
    'Too many attempts. Please repeat later',
  )
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
  @ApiOperation({
    summary: 'Check recovery token',
  })
  @ApiNoContentConfiguredResponse('Recovery token is valid')
  @ApiBadRequestConfiguredResponse('Invalid or expired recovery token')
  @ApiTooManyRequestsConfiguredResponse(
    'Too many attempts. Please repeat later',
  )
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
  @ApiOperation({
    summary:
      'Resend password recovery link. Email with confirmation code will be send to passed email address',
  })
  @ApiNoContentConfiguredResponse(
    'Password recovery link has been sent to the specified email',
  )
  @ApiBadRequestConfiguredResponse('Invalid email')
  @ApiForbiddenConfiguredResponse('Email not verified')
  @ApiTooManyRequestsConfiguredResponse(
    'Too many attempts. Please repeat later',
  )
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
  @ApiOperation({
    summary: 'Sets new password, deactivates all user sessions',
  })
  @ApiNoContentConfiguredResponse('Password successfully changed')
  @ApiBadRequestConfiguredResponse('Invalid or expired recovery token')
  @ApiTooManyRequestsConfiguredResponse(
    'Too many attempts. Please repeat later',
  )
  async newPassword(
    @Body()
    newPasswordInputDto: NewPasswordInputDto,
  ): Promise<void> {
    await this.commandBus.execute(new NewPasswordCommand(newPasswordInputDto));
  }
}
