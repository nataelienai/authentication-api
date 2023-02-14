import { Either, left, right } from '@/shared/either';
import { InvalidEmailError } from './errors/invalid-email-error';

// regexp source: https://github.com/angular/angular/blob/15.1.x/packages/forms/src/validators.ts
const EMAIL_REGEXP =
  /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export class Email {
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
    return email.match(EMAIL_REGEXP);
  }
}
