import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { UserAccountConfig } from '../../../core/config/user-account.config';
import { DomainException } from '@app/core/exceptions';
import { CommonExceptionCodes } from '@app/core/exceptions/enums';
import { firstValueFrom } from 'rxjs';
import {
  RECAPTCHA_MIN_SCORE,
  RECAPTCHA_TEST_SCORE,
} from '../../../core/constants/dto.constants';

type RecaptchaResponse = Partial<{
  success: true | false;
  challenge_ts: string;
  hostname: string;
  score: number;
  action: string;
  'error-codes': string[];
}>;

@Injectable()
export class RecaptchaService {
  private readonly secretKey: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly userAccountConfig: UserAccountConfig,
  ) {
    this.secretKey = this.userAccountConfig.RECAPTCHA_SECRET_KEY;
  }

  async verifyRecaptcha(token: string): Promise<void> {
    const response = await firstValueFrom(
      this.httpService.post<RecaptchaResponse>(
        this.userAccountConfig.RECAPTCHA_URL,
        null,
        {
          params: { secret: this.secretKey, response: token },
        },
      ),
    );
    if (response.data['error-codes']) {
      throw new DomainException(
        CommonExceptionCodes.BAD_REQUEST,
        'reCAPTCHA token is invalid',
        [{ key: 'field', message: 'recaptchaToken' }],
      );
    }

    if (!response.data.score || response.data.score >= RECAPTCHA_TEST_SCORE) {
      throw new DomainException(
        CommonExceptionCodes.BAD_REQUEST,
        'Test reCAPTCHA keys are not allowed',
        [{ key: 'field', message: 'recaptchaToken' }],
      );
    }

    if (!response.data.success) {
      throw new DomainException(
        CommonExceptionCodes.BAD_REQUEST,
        'reCAPTCHA verification failed',
        [{ key: 'field', message: 'recaptchaToken' }],
      );
    }

    if (response.data.score < RECAPTCHA_MIN_SCORE) {
      throw new DomainException(
        CommonExceptionCodes.BAD_REQUEST,
        'reCAPTCHA score too low',
        [{ key: 'field', message: 'recaptchaToken' }],
      );
    }
  }
}
