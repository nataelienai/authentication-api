import { SignInRequest } from '@/application/use-cases/sign-in';
import { InvalidHttpRequestError } from '@/presentation/errors/invalid-http-request-error';
import { HttpRequest } from '@/presentation/ports/http-request';
import { HttpRequestParser } from '@/presentation/ports/http-request-parser';
import { Either, left, right } from '@/shared/either';
import { z, ZodError } from 'zod';

export class SignInHttpRequestParser
  implements HttpRequestParser<SignInRequest>
{
  private static readonly schema = z.object({
    email: z.string(),
    password: z.string(),
  });

  // eslint-disable-next-line class-methods-use-this
  parse(request: HttpRequest): Either<InvalidHttpRequestError, SignInRequest> {
    try {
      const signInRequest = SignInHttpRequestParser.schema.parse(request.body);
      return right(signInRequest);
    } catch (error) {
      if (error instanceof ZodError) {
        return left(new InvalidHttpRequestError(error.message));
      }
      throw error;
    }
  }
}
