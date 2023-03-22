import { InvalidHttpRequestError } from '@/presentation/errors/invalid-http-request-error';
import { HttpRequest } from '@/presentation/ports/http-request';
import { HttpRequestParser } from '@/presentation/ports/http-request-parser';
import { Either, left, right } from '@/shared/either';
import { ZodError } from 'zod';

export abstract class ZodHttpRequestParser<T> implements HttpRequestParser<T> {
  parse(request: HttpRequest): Either<InvalidHttpRequestError, T> {
    try {
      const useCaseRequest = this.parseRequest(request);
      return right(useCaseRequest);
    } catch (error) {
      if (error instanceof ZodError) {
        const { fieldErrors } = error.flatten();
        return left(
          new InvalidHttpRequestError(
            'Validation error',
            fieldErrors as Record<string, string[]>,
          ),
        );
      }
      throw error;
    }
  }

  protected abstract parseRequest(request: HttpRequest): T;
}
