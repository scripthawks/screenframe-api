import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { SignUpUserInputDto } from '../../../../../src/user-accounts/auth/api/input-dto/sign-up.input-dto';
import { expectWithErrorLog } from '../../../../core/helpers/expect-with-error-log';

export class AuthE2eManager {
  constructor(private readonly app: INestApplication<App>) {}

  async signUp(
    createdDto: SignUpUserInputDto,
    statusCode: number = HttpStatus.NO_CONTENT,
  ): Promise<void> {
    const response = await request(this.app.getHttpServer())
      .post('/api/v1/auth/signup')
      .send(createdDto);
    expectWithErrorLog(response, statusCode);
  }
}
