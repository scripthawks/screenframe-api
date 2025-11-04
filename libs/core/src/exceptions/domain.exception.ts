import { BaseException } from '.';
import { CommonExceptionCodes } from './enums';

export class DomainException extends BaseException {
  constructor(
    code: CommonExceptionCodes,
    message: string,
    extensions: { key: string; message: string }[] = [],
  ) {
    super(code, message, extensions);
  }
}
