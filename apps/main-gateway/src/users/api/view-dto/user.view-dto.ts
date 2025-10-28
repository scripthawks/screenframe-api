import {
  IsUUID,
  IsString,
  IsEmail,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UserRoleEnum } from '../enums/user-role.enum';

export class UserViewDto {
  @IsUUID()
  id: string;

  @IsString()
  user_name: string;

  @IsEmail()
  email: string;

  @IsString()
  password_hash: string;

  @IsDate()
  @Type(() => Date)
  created_at: Date;

  @IsDate()
  @Type(() => Date)
  updated_at: Date | null;

  @IsBoolean()
  is_verified: boolean;

  @IsBoolean()
  is_active: boolean;

  @IsEnum(UserRoleEnum)
  role: UserRoleEnum;

  @IsOptional()
  @IsString()
  avatar_url?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  last_login?: Date;
}
