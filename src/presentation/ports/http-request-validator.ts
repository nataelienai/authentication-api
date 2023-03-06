import { Either } from '@/shared/either';
import { InvalidHttpRequestError } from '../errors/invalid-http-request-error';
import { HttpRequest } from './http-request';

export interface HttpRequestValidator<T> {
  validate(request: HttpRequest): Either<InvalidHttpRequestError, T>;
}
