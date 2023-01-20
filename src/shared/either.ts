/* eslint-disable no-use-before-define */
/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */

export type Either<L, R> = Left<L, R> | Right<L, R>;

export class Left<L, R> {
  constructor(readonly value: L) {}

  isLeft(): this is Left<L, R> {
    return true;
  }

  isRight(): this is Right<L, R> {
    return false;
  }
}

export class Right<L, R> {
  constructor(readonly value: R) {}

  isLeft(): this is Left<L, R> {
    return false;
  }

  isRight(): this is Right<L, R> {
    return true;
  }
}

export function left<L, R>(value: L): Either<L, R> {
  return new Left(value);
}

export function right<L, R>(value: R): Either<L, R> {
  return new Right(value);
}
