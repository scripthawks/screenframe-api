import { SignUpUserInputDto } from '../../../../../src/user-accounts/auth/api/input-dto/sign-up.input-dto';

export const createValidSignUpInputDto = (
  count: number = 1,
): SignUpUserInputDto => {
  const signUpDto = new SignUpUserInputDto();
  signUpDto.userName = `User_${count}`;
  signUpDto.email = `Email_${count}@gmail.com`;
  signUpDto.password = `Password!_${count}`;
  signUpDto.passwordConfirmation = signUpDto.password;
  signUpDto.acceptedTerms = true;
  return signUpDto;
};

export const createInValidSignUpInputDto = (
  count: number = 1,
): SignUpUserInputDto => {
  const signUpDto = new SignUpUserInputDto();
  signUpDto.userName = `User_${count}`;
  signUpDto.email = `invalid email_${count}`;
  signUpDto.password = `Password!_${count}`;
  signUpDto.passwordConfirmation = signUpDto.password;
  signUpDto.acceptedTerms = true;
  return signUpDto;
};
