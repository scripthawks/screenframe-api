import { TrimIsString } from '@app/core/decorators/validation';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import {
  FIRST_NAME_MIN_LENGTH,
  FIRST_NAME_MAX_LENGTH,
  FIRST_NAME_REGEX,
  LAST_NAME_REGEX,
  LAST_NAME_MIN_LENGTH,
  LAST_NAME_MAX_LENGTH,
  ABOUT_ME_MIN_LENGTH,
  ABOUT_ME_MAX_LENGTH,
} from '../../../core/constants/dto.constants';
import { Transform } from 'class-transformer';

export class UpdateProfileInputDto {
  @IsOptional()
  @IsNotEmpty({ message: 'First name is required' })
  @TrimIsString()
  @Length(FIRST_NAME_MIN_LENGTH, FIRST_NAME_MAX_LENGTH, {
    message: 'First name must be between 1 and 50 characters',
  })
  @Matches(FIRST_NAME_REGEX, {
    message:
      'First name must contain only letters, numbers, dashes(-) and underscores(_)',
  })
  @ApiProperty()
  firstName?: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Last name is required' })
  @TrimIsString()
  @Length(LAST_NAME_MIN_LENGTH, LAST_NAME_MAX_LENGTH, {
    message: 'Last name must be between 1 and 50 characters',
  })
  @Matches(LAST_NAME_REGEX, {
    message:
      'Last name must contain only letters, numbers, dashes(-) and underscores(_)',
  })
  @ApiProperty()
  lastName?: string;

  @IsOptional()
  @Transform(({ value }: { value: string }) => (value ? new Date(value) : null))
  @IsDate({ message: 'Birth date must be a valid date' })
  @ApiProperty({ example: '1990-01-01' })
  birthDate?: Date;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Madagascar' })
  country?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Antananarivo' })
  city?: string;

  @IsOptional()
  @IsString()
  @Length(ABOUT_ME_MIN_LENGTH, ABOUT_ME_MAX_LENGTH, {
    message: 'About me must be between 1 and 200 characters',
  })
  @ApiProperty({ example: 'I am a software engineer' })
  about?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'avatar.png' })
  userName?: string;
}
