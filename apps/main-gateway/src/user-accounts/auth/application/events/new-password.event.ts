export class NewPasswordEvent {
  constructor(
    public readonly userName: string,
    public readonly email: string,
  ) {}
}
