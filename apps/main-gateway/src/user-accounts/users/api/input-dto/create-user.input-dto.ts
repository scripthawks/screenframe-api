import { IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class CreateUserInputDto {
  @IsNotEmpty()
  @IsString()
  userName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
