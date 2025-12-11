import { TrimIsString } from '@app/core/decorators/validation';
import { ApiProperty } from '@nestjs/swagger';

export class LoginInputDto {
  @ApiProperty()
  @TrimIsString()
  userNameOrEmail: string;

  @ApiProperty()
  @TrimIsString()
  password: string;
}
