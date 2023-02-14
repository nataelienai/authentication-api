import { Either, left, right } from '@/shared/either';
import { InvalidPasswordError } from './errors/invalid-password-error';

const PASSWORD_REGEXP = /^[A-Za-z0-9~!@#$%^&*_\-+=`|\\(){}[\]:;"'<>,.?/]+$/;
const PASSWORD_MIN_LENGTH = 8;

export class Password {
  private constructor(private readonly password: string) {}

  get value() {
    return this.password;
  }

  static create(password: string): Either<InvalidPasswordError, Password> {
    if (!this.hasMinLength(password)) {
      return left(
        new InvalidPasswordError(
          `The password must be at least ${PASSWORD_MIN_LENGTH} characters long`,
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
    return password.length < PASSWORD_MIN_LENGTH;
  }

  static hasValidCharacters(password: string) {
    return password.match(PASSWORD_REGEXP);
  }
}
