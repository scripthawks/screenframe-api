import { ArgumentsHost, Catch } from '@nestjs/common';
import { DomainException } from '../exceptions';
import { BaseExceptionFilter } from '.';

@Catch(DomainException)
export class DomainExceptionFilter extends BaseExceptionFilter<DomainException> {
  catch(exception: DomainException, host: ArgumentsHost): void {
    this.handleException(exception, host);
  }
}
