import { Injectable } from '@nestjs/common';
import { UserAccountConfig } from '../../../core/config/user-account.config';
import { DomainException } from '@app/core/exceptions';
import { CommonExceptionCodes } from '@app/core/exceptions/enums';
import axios from 'axios';

type RecaptchaResponse = Partial<{
  success: true | false;
  challenge_ts: string;
  hostname: string;
  'error-codes': string[];
}>;

@Injectable()
export class RecaptchaService {
  private readonly secretKey: string;
  constructor(private readonly userAccountConfig: UserAccountConfig) {
    this.secretKey = this.userAccountConfig.RECAPTCHA_SECRET_KEY;
  }

  async verifyRecaptcha(token: string): Promise<void> {
    const { success, 'error-codes': errorCodes } =
      await this.fetchRecaptchaResponse(token);

    if (errorCodes) {
      throw new DomainException(
        CommonExceptionCodes.BAD_REQUEST,
        'reCAPTCHA token is invalid',
        [{ key: 'field', message: 'recaptchaToken' }],
      );
    }

    if (!success) {
      throw new DomainException(
        CommonExceptionCodes.BAD_REQUEST,
        'reCAPTCHA verification failed',
        [{ key: 'field', message: 'recaptchaToken' }],
      );
    }
  }

  private async fetchRecaptchaResponse(
    token: string,
  ): Promise<RecaptchaResponse> {
    const response = await axios.post<RecaptchaResponse>(
      this.userAccountConfig.RECAPTCHA_URL,
      null,
      {
        params: { secret: this.secretKey, response: token },
      },
    );
    return response.data;
  }
}
