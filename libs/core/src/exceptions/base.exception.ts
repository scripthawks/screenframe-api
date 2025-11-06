import { CommonExceptionCodes } from './enums';

export abstract class BaseException extends Error {
  protected constructor(
    public readonly code: CommonExceptionCodes,
    message: string,
    public readonly extensions: { key: string; message: string }[] = [],
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
