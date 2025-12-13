import { TrimIsString } from '@app/core/decorators/validation';

export class UserInfoInputDto {
  @TrimIsString()
  user: string;

  @TrimIsString()
  sessionId: string;
}
