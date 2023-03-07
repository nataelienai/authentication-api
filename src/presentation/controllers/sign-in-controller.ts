import { UserNotFoundError } from '@/application/errors/user-not-found-error';
import {
  SignIn,
  SignInRequest,
  SignInResponse,
} from '@/application/use-cases/sign-in';
import { HttpRequestValidator } from '../ports/http-request-validator';
import { HttpResponse } from '../ports/http-response';
import { Controller } from './controller';

export class SignInController extends Controller<
  SignInRequest,
  SignInResponse
> {
  constructor(
    private readonly signIn: SignIn,
    httpRequestValidator: HttpRequestValidator<SignInRequest>,
  ) {
    super(httpRequestValidator);
  }

  protected async execute(
    signInRequest: SignInRequest,
  ): Promise<HttpResponse<Error | SignInResponse>> {
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
