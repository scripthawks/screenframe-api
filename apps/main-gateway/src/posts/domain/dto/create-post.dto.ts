import { IsOptional, Length } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Trim } from '@app/core/decorators/transform/trim';

export class CreatePostDto {
  @ApiPropertyOptional({
    example: 'Short description of the post',
    description: 'Maximum length is 500 characters',
    maxLength: 500,
  })
  @IsOptional()
  @Trim()
  @Length(3, 500)
  description: string;
}
