import { DomainException } from '@app/core/exceptions';
import { CommonExceptionCodes } from '@app/core/exceptions/enums';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

interface TermsGuardRequest {
  body: {
    acceptedTerms?: unknown;
  };
}

@Injectable()
export class AcceptedTermsGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<TermsGuardRequest>();
    const acceptedTerms = request.body.acceptedTerms;

    if (acceptedTerms !== true) {
      throw new DomainException(
        CommonExceptionCodes.NOT_FOUND,
        'To register, you must accept the terms of service.',
      );
    }

    return true;
  }
}
