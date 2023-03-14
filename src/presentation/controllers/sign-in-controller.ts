import { UserNotFoundError } from '@/application/errors/user-not-found-error';
import {
  SignIn,
  SignInRequest,
  SignInResponse,
} from '@/application/use-cases/sign-in';
import { HttpRequestParser } from '../ports/http-request-parser';
import { HttpResponse } from '../ports/http-response';
import { HttpServer } from '../ports/http-server';
import { badRequest, notFound, ok } from '../utils/http-responses';
import { Controller } from './controller';

export class SignInController extends Controller<
  SignInRequest,
  SignInResponse
> {
  constructor(
    private readonly signIn: SignIn,
    httpRequestParser: HttpRequestParser<SignInRequest>,
    httpServer: HttpServer,
  ) {
    super(httpRequestParser);
    httpServer.on('post', '/sign-in', this);
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
