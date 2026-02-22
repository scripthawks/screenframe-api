import {
  createInValidSignUpInputDto,
  createValidSignUpInputDto,
} from '../dtos/sign-up.input-dto';

export class E2eDtoFactory {
  static createValidSignUpInputDto = createValidSignUpInputDto;
  static createInValidSignUpInputDto = createInValidSignUpInputDto;
}
