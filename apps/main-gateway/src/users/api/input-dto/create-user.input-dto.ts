import { IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class CreateUserInputDto {
  @IsNotEmpty()
  @IsString()
  user_name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password_hash: string;
}
