import { EmailAlreadyExistsError } from '@/application/errors/email-already-exists-error';
import {
  SignUp,
  SignUpRequest,
  SignUpResponse,
} from '@/application/use-cases/sign-up';
import { HttpRequestValidator } from '../ports/http-request-validator';
import { HttpResponse } from '../ports/http-response';
import { HttpServer } from '../ports/http-server';
import { Controller } from './controller';

export class SignUpController extends Controller<
  SignUpRequest,
  SignUpResponse
> {
  constructor(
    private readonly signUp: SignUp,
    httpRequestValidator: HttpRequestValidator<SignUpRequest>,
    httpServer: HttpServer,
  ) {
    super(httpRequestValidator);
    httpServer.on('post', '/sign-up', this);
  }

  protected async execute(
    signUpRequest: SignUpRequest,
  ): Promise<HttpResponse<Error | SignUpResponse>> {
    const errorOrSignUpResponse = await this.signUp.execute(signUpRequest);

    if (errorOrSignUpResponse.isLeft()) {
      const error = errorOrSignUpResponse.value;

      if (error instanceof EmailAlreadyExistsError) {
        return { statusCode: 409, body: error };
      }

      return { statusCode: 400, body: error };
    }

    const signUpResponse = errorOrSignUpResponse.value;
    return { statusCode: 201, body: signUpResponse };
  }
}
