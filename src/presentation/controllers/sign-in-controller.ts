import { UserNotFoundError } from '@/application/errors/user-not-found-error';
import {
  SignIn,
  SignInRequest,
  SignInResponse,
} from '@/application/use-cases/sign-in';
import { HttpRequestParser } from '../ports/http-request-parser';
import { HttpResponse } from '../ports/http-response';
import { HttpRoute } from '../ports/http-route';
import { badRequest, notFound, ok } from '../utils/http-responses';
import { Controller } from './controller';

export class SignInController extends Controller<
  SignInRequest,
  SignInResponse
> {
  private readonly httpRoute: HttpRoute = {
    method: 'post',
    path: '/sign-in',
  };

  constructor(
    private readonly signIn: SignIn,
    httpRequestParser: HttpRequestParser<SignInRequest>,
  ) {
    super(httpRequestParser);
  }

  get route() {
    return this.httpRoute;
  }

  protected async execute(
    signInRequest: SignInRequest,
  ): Promise<HttpResponse<Error | SignInResponse>> {
    const errorOrSignInResponse = await this.signIn.execute(signInRequest);

    if (errorOrSignInResponse.isLeft()) {
      const error = errorOrSignInResponse.value;

      if (error instanceof UserNotFoundError) {
        return notFound(error);
      }

      return badRequest(error);
    }

    const signInResponse = errorOrSignInResponse.value;
    return ok(signInResponse);
  }
}
