import { ArgumentsHost, Catch } from '@nestjs/common';
import { RepositoryException } from '../exceptions';
import { BaseExceptionFilter } from '.';

@Catch(RepositoryException)
export class RepositoryExceptionFilter extends BaseExceptionFilter<RepositoryException> {
  catch(exception: RepositoryException, host: ArgumentsHost): void {
    this.handleException(exception, host);
  }
}
