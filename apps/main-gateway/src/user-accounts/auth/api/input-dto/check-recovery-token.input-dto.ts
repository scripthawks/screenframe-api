import { TrimIsString } from '@app/core/decorators/validation';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckRecoveryTokenInputDto {
  @TrimIsString()
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({ description: 'Recovery token from email link' })
  recoveryToken: string;
}
