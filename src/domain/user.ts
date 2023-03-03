import { Either, left, right } from '@/shared/either';
import { Optional } from '@/shared/optional';
import { randomUUID } from 'crypto';
import { Email } from './email';
import { InvalidTimestampsError } from './errors/invalid-timestamps-error';
import { HashedPassword } from './hashed-password';

interface UserProps {
  id: string;
  email: Email;
  hashedPassword: HashedPassword;
  createdAt: Date;
  updatedAt: Date;
}

type CreateUserProps = Optional<UserProps, 'id' | 'createdAt' | 'updatedAt'>;

export class User {
  private constructor(private props: UserProps) {}

  get id() {
    return this.props.id;
  }

  get email() {
    return this.props.email;
  }

  set email(email: Email) {
    this.props.updatedAt = new Date();
    this.props.email = email;
  }

  get hashedPassword() {
    return this.props.hashedPassword;
  }

  set hashedPassword(hashedPassword: HashedPassword) {
    this.props.updatedAt = new Date();
    this.props.hashedPassword = hashedPassword;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(props: CreateUserProps): Either<InvalidTimestampsError, User> {
    if (
      (props.createdAt && !props.updatedAt) ||
      (!props.createdAt && props.updatedAt)
    ) {
      return left(
        new InvalidTimestampsError(
          'The createdAt and updatedAt dates must be provided together',
        ),
      );
    }

    if (
      props.createdAt &&
      props.updatedAt &&
      props.createdAt > props.updatedAt
    ) {
      return left(
        new InvalidTimestampsError(
          'The createdAt date must not be later than the updatedAt date',
        ),
      );
    }

    return right(
      new User({
        ...props,
        id: props.id ?? randomUUID(),
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      }),
    );
  }
}
