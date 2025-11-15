import { ApiProperty } from '@nestjs/swagger';
import { ApiFieldErrorDto } from '.';

export class ApiErrorResultDto {
  @ApiProperty({ nullable: true, type: [ApiFieldErrorDto], required: false })
  errorsMessages: ApiFieldErrorDto[] | null;
}
