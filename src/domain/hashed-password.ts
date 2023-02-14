export class HashedPassword {
  constructor(private readonly hashedPassword: string) {}

  get value() {
    return this.hashedPassword;
  }
}
