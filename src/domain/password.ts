import { Either, left, right } from '@/shared/either';
import { InvalidPasswordError } from './errors/invalid-password-error';

export class Password {
  private static readonly FORMAT_REGEXP =
    /^[\w!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~-]+$/;

  private static readonly MIN_LENGTH = 8;

  private constructor(private readonly password: string) {}

  get value() {
    return this.password;
  }

  static create(password: string): Either<InvalidPasswordError, Password> {
    if (!this.hasMinLength(password)) {
      return left(
        new InvalidPasswordError(
          `The password must be at least ${Password.MIN_LENGTH} characters long`,
        ),
      );
    }

    if (!this.hasValidCharacters(password)) {
      return left(
        new InvalidPasswordError(
          'The password must have only letters, numbers and the symbols: ~!@#$%^&*_-+=`|\\(){}[]:;"\'<>,.?/',
        ),
      );
    }

    return right(new Password(password));
  }

  static hasMinLength(password: string) {
    return password.length < Password.MIN_LENGTH;
  }

  static hasValidCharacters(password: string) {
    return password.match(Password.FORMAT_REGEXP);
  }
}
