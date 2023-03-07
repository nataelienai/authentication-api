import { UserNotFoundError } from '@/application/errors/user-not-found-error';
import {
  SignIn,
  SignInRequest,
  SignInResponse,
} from '@/application/use-cases/sign-in';
import { HttpRequest } from '../ports/http-request';
import { HttpRequestValidator } from '../ports/http-request-validator';
import { HttpResponse } from '../ports/http-response';

export class SignInController {
  constructor(
    private readonly signIn: SignIn,
    private readonly httpRequestValidator: HttpRequestValidator<SignInRequest>,
  ) {}

  async handle(
    request: HttpRequest,
  ): Promise<HttpResponse<Error | SignInResponse>> {
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
