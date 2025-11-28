import {
  CanActivate,
  ExecutionContext,
  BadRequestException,
  Injectable,
} from '@nestjs/common';

interface PasswordConfirmationOptions {
  passwordField?: string;
  confirmationField?: string;
  deleteConfirmation?: boolean;
}

interface RequestBody {
  [key: string]: unknown;
}

@Injectable()
export class PasswordConfirmationGuard implements CanActivate {
  private readonly defaultOptions: Required<PasswordConfirmationOptions> = {
    passwordField: 'password',
    confirmationField: 'passwordConfirmation',
    deleteConfirmation: true,
  };

  static withOptions(options: PasswordConfirmationOptions) {
    const guard = new PasswordConfirmationGuard();
    return {
      canActivate: (context: ExecutionContext) =>
        guard.validate(context, { ...guard.defaultOptions, ...options }),
    };
  }

  canActivate(context: ExecutionContext): boolean {
    return this.validate(context, this.defaultOptions);
  }

  private validate(
    context: ExecutionContext,
    options: Required<PasswordConfirmationOptions>,
  ): boolean {
    const { passwordField, confirmationField, deleteConfirmation } = options;

    const request = context.switchToHttp().getRequest<{ body: RequestBody }>();
    const { body } = request;

    const password = body[passwordField];
    const confirmation = body[confirmationField];

    if (!password || !confirmation) {
      throw new BadRequestException(
        `${passwordField} and ${confirmationField} are required`,
      );
    }

    if (password !== confirmation) {
      throw new BadRequestException(
        `${confirmationField} does not match ${passwordField}`,
      );
    }

    if (deleteConfirmation) {
      delete body[confirmationField];
    }

    return true;
  }
}
