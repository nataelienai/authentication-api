import { Either, left, right } from '@/shared/either';
import { InvalidPasswordError } from './errors/invalid-password-error';

export class Password {
  private static readonly MIN_LENGTH = 8;
  private static readonly FORMAT_REGEX =
    /^[\w!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~-]+$/;

  private constructor(private readonly password: string) {}

  get value() {
    return this.password;
  }

  static create(password: string): Either<InvalidPasswordError, Password> {
    if (!Password.hasMinLength(password)) {
      return left(
        new InvalidPasswordError(
          `The password must be at least ${Password.MIN_LENGTH} characters long`,
        ),
      );
    }

    if (!Password.hasValidCharacters(password)) {
      return left(
        new InvalidPasswordError(
          'The password must have only letters, numbers and the symbols: ~!@#$%^&*_-+=`|\\(){}[]:;"\'<>,.?/',
        ),
      );
    }

    return right(new Password(password));
  }

  private static hasMinLength(password: string) {
    return password.length >= Password.MIN_LENGTH;
  }

  private static hasValidCharacters(password: string) {
    return Password.FORMAT_REGEX.test(password);
  }
}
