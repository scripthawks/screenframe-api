export class PasswordRecoveryRequestedEvent {
  constructor(
    public readonly userName: string,
    public readonly recoveryToken: string,
    public readonly email: string,
  ) {}
}
