import {
  CanActivate,
  ExecutionContext,
  Injectable,
  BadRequestException,
} from '@nestjs/common';

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
      throw new BadRequestException(
        'Для регистрации необходимо принять правила сервиса',
      );
    }

    return true;
  }
}
