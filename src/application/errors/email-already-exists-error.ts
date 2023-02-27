export class EmailAlreadyExistsError extends Error {
  constructor(email: string) {
    super(`The email '${email}' is already registered`);
  }
}
