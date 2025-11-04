import { CommonExceptionCodes } from '../../exceptions/enums';

export class ErrorResponseBuilder {
  static build(
    requestUrl: string,
    message: string,
    code: CommonExceptionCodes,
    isProduction: boolean,
    extensions: { key: string; message: string }[] = [],
  ) {
    if (isProduction) {
      return {
        timestamp: new Date().toISOString(),
        path: null,
        message: this.getProductionMessage(code),
        extensions: [],
        code: CommonExceptionCodes.INTERNAL_SERVER_ERROR,
      };
    }

    return {
      timestamp: new Date().toISOString(),
      path: requestUrl,
      message,
      extensions,
      code,
    };
  }

  private static getProductionMessage(code: CommonExceptionCodes): string {
    switch (code) {
      case CommonExceptionCodes.NOT_FOUND:
        return 'Resource not found';
      case CommonExceptionCodes.BAD_REQUEST:
        return 'Invalid request';
      default:
        return 'Internal server error';
    }
  }
}
