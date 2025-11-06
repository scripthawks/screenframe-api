import {
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseException } from '@app/core/exceptions';
import { CoreConfig } from '../config';
import { ErrorResponseBuilder } from './utils';
import { CommonExceptionCodes } from '@app/core/exceptions/enums';
import { Environments } from '../enums';
import { Socket } from 'socket.io';

export abstract class BaseExceptionFilter<T = any> implements ExceptionFilter {
  constructor(protected readonly coreConfig: CoreConfig) {}

  abstract catch(exception: T, host: ArgumentsHost): void;

  protected handleException(exception: any, host: ArgumentsHost): void {
    const contextType = host.getType();

    if (contextType === 'ws') {
      this.handleWsException(exception, host);
    } else {
      this.handleHttpException(exception, host);
    }
  }

  private handleHttpException(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    if (exception instanceof BaseException) {
      const status = this.mapToHttpStatus(exception.code);
      const responseBody = ErrorResponseBuilder.build(
        request.url,
        exception.message,
        exception.code,
        this.isProduction(),
        exception.extensions,
      );
      response.status(status).json(responseBody);
      return;
    }
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const message = this.getSimpleMessage(exception.getResponse());
      const code = this.mapHttpStatusToCode(status);

      const responseBody = ErrorResponseBuilder.build(
        request.url,
        message,
        code,
        this.isProduction(),
      );
      response.status(status).json(responseBody);
      return;
    }
    const responseBody = ErrorResponseBuilder.build(
      request.url,
      'Internal server error',
      CommonExceptionCodes.INTERNAL_SERVER_ERROR,
      this.isProduction(),
    );
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(responseBody);
  }

  private handleWsException(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToWs();
    const client = ctx.getClient<Socket>();
    const pattern = ctx.getPattern();
    const requestInfo = `ws://${pattern}`;
    if (exception instanceof BaseException) {
      const responseBody = ErrorResponseBuilder.build(
        requestInfo,
        exception.message,
        exception.code,
        this.isProduction(),
        exception.extensions,
      );
      this.sendWsError(client, responseBody);
      return;
    }
    if (exception instanceof HttpException) {
      const message = this.getSimpleMessage(exception.getResponse());
      const code = this.mapHttpStatusToCode(exception.getStatus());
      const responseBody = ErrorResponseBuilder.build(
        requestInfo,
        message,
        code,
        this.isProduction(),
      );
      this.sendWsError(client, responseBody);
      return;
    }
    const responseBody = ErrorResponseBuilder.build(
      requestInfo,
      'Internal server error',
      CommonExceptionCodes.INTERNAL_SERVER_ERROR,
      this.isProduction(),
    );
    this.sendWsError(client, responseBody);
  }

  private sendWsError(client: Socket, errorResponse: any): void {
    client.emit('error', errorResponse);
  }

  protected mapToHttpStatus(code: CommonExceptionCodes): number {
    switch (code) {
      case CommonExceptionCodes.BAD_REQUEST:
        return HttpStatus.BAD_REQUEST;
      case CommonExceptionCodes.NOT_FOUND:
        return HttpStatus.NOT_FOUND;
      case CommonExceptionCodes.UNAUTHORIZED:
        return HttpStatus.UNAUTHORIZED;
      case CommonExceptionCodes.FORBIDDEN:
        return HttpStatus.FORBIDDEN;
      case CommonExceptionCodes.CONFLICT:
        return HttpStatus.CONFLICT;
      case CommonExceptionCodes.TOO_MANY_REQUEST:
        return HttpStatus.TOO_MANY_REQUESTS;
      default:
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }

  private mapHttpStatusToCode(httpStatus: number): CommonExceptionCodes {
    switch (httpStatus) {
      case 400:
        return CommonExceptionCodes.BAD_REQUEST;
      case 401:
        return CommonExceptionCodes.UNAUTHORIZED;
      case 403:
        return CommonExceptionCodes.FORBIDDEN;
      case 404:
        return CommonExceptionCodes.NOT_FOUND;
      case 409:
        return CommonExceptionCodes.CONFLICT;
      case 429:
        return CommonExceptionCodes.TOO_MANY_REQUEST;
      default:
        return CommonExceptionCodes.INTERNAL_SERVER_ERROR;
    }
  }
  private getSimpleMessage(exceptionResponse: any): string {
    if (typeof exceptionResponse === 'string') {
      return exceptionResponse;
    }
    if (
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null &&
      'message' in exceptionResponse
    ) {
      const message = (exceptionResponse as { message: unknown }).message;
      if (Array.isArray(message)) {
        return message[0] as string;
      }
      if (typeof message === 'string') {
        return message;
      }
    }
    return 'Error occurred';
  }

  protected isProduction(): boolean {
    return this.coreConfig.ENV === Environments.PRODUCTION;
  }
}
