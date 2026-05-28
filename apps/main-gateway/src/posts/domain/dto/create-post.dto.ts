import { Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Trim } from '@app/core/decorators/transform/trim';

export class CreatePostDto {
  @ApiProperty({
    example: 'Short description of the post',
    description: 'Maximum length is 500 characters',
    maxLength: 500,
  })
  @Trim()
  @Length(3, 500)
  description: string;
}
