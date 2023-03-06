import { UserNotFoundError } from '@/application/errors/user-not-found-error';
import {
  SignIn,
  SignInRequest,
  SignInResponse,
} from '@/application/use-cases/sign-in';
import { Either } from '@/shared/either';
import { InvalidHttpRequestError } from '../errors/invalid-http-request-error';
import { HttpRequest } from '../ports/http-request';

type HttpResponse = {
  statusCode: number;
  body: SignInResponse | Error;
};

interface HttpRequestValidator {
  validate(
    request: HttpRequest,
  ): Either<InvalidHttpRequestError, SignInRequest>;
}

export class SignInController {
  constructor(
    private readonly signIn: SignIn,
    private readonly httpRequestValidator: HttpRequestValidator,
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    const errorOrSignInRequest = this.httpRequestValidator.validate(request);

    if (errorOrSignInRequest.isLeft()) {
      const error = errorOrSignInRequest.value;
      return { statusCode: 400, body: error };
    }

    const signInRequest = errorOrSignInRequest.value;
    const errorOrSignInResponse = await this.signIn.execute(signInRequest);

    if (errorOrSignInResponse.isLeft()) {
      const error = errorOrSignInResponse.value;

      if (error instanceof UserNotFoundError) {
        return { statusCode: 404, body: error };
      }

      return { statusCode: 400, body: error };
    }

    const signInResponse = errorOrSignInResponse.value;
    return { statusCode: 200, body: signInResponse };
  }
}
