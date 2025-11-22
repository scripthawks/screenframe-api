export class UserSignUpEvent {
  constructor(
    public readonly userName: string,
    public readonly emailToken: string,
    public readonly email: string,
  ) {}
}
