import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseExceptionFilter } from '.';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost): void {
    this.handleException(exception, host);
  }
}
