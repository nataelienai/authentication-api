import { SignUpRequest } from '@/application/use-cases/sign-up';
import { InvalidHttpRequestError } from '@/presentation/errors/invalid-http-request-error';
import { HttpRequest } from '@/presentation/ports/http-request';
import { HttpRequestParser } from '@/presentation/ports/http-request-parser';
import { Either, left, right } from '@/shared/either';
import { z, ZodError } from 'zod';

export class SignUpHttpRequestParser
  implements HttpRequestParser<SignUpRequest>
{
  private static readonly schema = z.object({
    email: z.string(),
    password: z.string(),
  });

  // eslint-disable-next-line class-methods-use-this
  parse(request: HttpRequest): Either<InvalidHttpRequestError, SignUpRequest> {
    try {
      const signUpRequest = SignUpHttpRequestParser.schema.parse(request.body);
      return right(signUpRequest);
    } catch (error) {
      if (error instanceof ZodError) {
        return left(new InvalidHttpRequestError(error.message));
      }
      throw error;
    }
  }
}
