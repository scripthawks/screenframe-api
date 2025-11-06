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
  login: string;

  @IsEmail()
  email: string;

  @IsString()
  passwordHash: string;

  @IsDate()
  @Type(() => Date)
  created_at: Date;

  @IsDate()
  @Type(() => Date)
  updatedAt: Date | null;

  @IsBoolean()
  isVerified: boolean;

  @IsBoolean()
  isActive: boolean;

  @IsEnum(UserRoleEnum)
  role: UserRoleEnum;

  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  lastLogin?: Date;
}
