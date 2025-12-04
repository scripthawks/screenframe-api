import { TrimIsString } from '@app/core/decorators/validation';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailInputDto {
  @TrimIsString()
  @ApiProperty({ description: 'Token that be sent via Email inside link' })
  confirmationToken: string;
}
