import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { CreateUserInputDto } from '../../users/api/input-dto/create-user.input-dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { SignUpCommand } from '../application/use-cases/sign-up.use-case';
import { VerifyEmailCommand } from '../application/use-cases/verify-email.use-case';
import { VerifyEmailInputDto } from './input-dto/verify-email.input-dto';
import {
  ApiBadRequestConfiguredResponse,
  ApiConflictConfiguredResponse,
  ApiNoContentConfiguredResponse,
} from '@app/core/decorators/swagger';
import { PasswordConfirmationGuard } from './guards/confirmation-password.guard';
import { AcceptedTermsGuard } from './guards/accepted-terms.guard';
import { ResendVerificationInputDto } from './input-dto/resend-verification.input-dto';
import { ResendVerificationCommand } from '../application/use-cases/resend-verification.use-case';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('signup')
  @UseGuards(PasswordConfirmationGuard)
  @UseGuards(AcceptedTermsGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiConflictConfiguredResponse('User already exists')
  @ApiBadRequestConfiguredResponse('Validation failed')
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
}
