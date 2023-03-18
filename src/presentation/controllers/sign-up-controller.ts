import { EmailAlreadyExistsError } from '@/application/errors/email-already-exists-error';
import {
  SignUp,
  SignUpRequest,
  SignUpResponse,
} from '@/application/use-cases/sign-up';
import { HttpRequestParser } from '../ports/http-request-parser';
import { HttpResponse } from '../ports/http-response';
import { HttpRoute } from '../ports/http-route';
import { HttpServer } from '../ports/http-server';
import { badRequest, conflict, created } from '../utils/http-responses';
import { Controller } from './controller';

export class SignUpController extends Controller<
  SignUpRequest,
  SignUpResponse
> {
  private readonly httpRoute: HttpRoute = {
    method: 'post',
    path: '/sign-up',
  };

  constructor(
    private readonly signUp: SignUp,
    httpRequestParser: HttpRequestParser<SignUpRequest>,
    httpServer: HttpServer,
  ) {
    super(httpRequestParser);
    httpServer.on('post', '/sign-up', this);
  }

  get route() {
    return this.httpRoute;
  }

  protected async execute(
    signUpRequest: SignUpRequest,
  ): Promise<HttpResponse<Error | SignUpResponse>> {
    const errorOrSignUpResponse = await this.signUp.execute(signUpRequest);

    if (errorOrSignUpResponse.isLeft()) {
      const error = errorOrSignUpResponse.value;

      if (error instanceof EmailAlreadyExistsError) {
        return conflict(error);
      }

      return badRequest(error);
    }

    const signUpResponse = errorOrSignUpResponse.value;
    return created(signUpResponse);
  }
}
