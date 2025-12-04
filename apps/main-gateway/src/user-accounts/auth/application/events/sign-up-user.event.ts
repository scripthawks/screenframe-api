export class UserSignUpEvent {
  constructor(
    public readonly userName: string,
    public readonly confirmationToken: string,
    public readonly email: string,
  ) {}
}
