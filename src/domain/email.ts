import { Either, left, right } from '@/shared/either';
import { InvalidEmailError } from './errors/invalid-email-error';

export class Email {
  // regexp source: https://github.com/angular/angular/blob/15.1.x/packages/forms/src/validators.ts
  // rule disabled because the regexp was tested and it is safe
  private static readonly FORMAT_REGEXP =
    // eslint-disable-next-line security/detect-unsafe-regex
    /^(?=.{1,254}$)(?=.{1,64}@)[\w!#$%&'*+/=?^`{|}~-]+(?:\.[\w!#$%&'*+/=?^`{|}~-]+)*@[\dA-Za-z](?:[\dA-Za-z-]{0,61}[\dA-Za-z])?(?:\.[\dA-Za-z](?:[\dA-Za-z-]{0,61}[\dA-Za-z])?)*$/;

  private constructor(private readonly email: string) {}

  get value() {
    return this.email;
  }

  static create(email: string): Either<InvalidEmailError, Email> {
    if (!this.hasValidFormat(email)) {
      return left(new InvalidEmailError(email));
    }

    return right(new Email(email));
  }

  static hasValidFormat(email: string) {
    return email.match(Email.FORMAT_REGEXP);
  }
}
