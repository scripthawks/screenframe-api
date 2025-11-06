import { IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class CreateUserInputDto {
  @IsNotEmpty()
  @IsString()
  login: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  passwordHash: string;
}
