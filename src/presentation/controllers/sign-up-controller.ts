import { EmailAlreadyExistsError } from '@/application/errors/email-already-exists-error';
import {
  SignUp,
  SignUpRequest,
  SignUpResponse,
} from '@/application/use-cases/sign-up';
import { HttpRequest } from '../ports/http-request';
import { HttpRequestValidator } from '../ports/http-request-validator';
import { HttpResponse } from '../ports/http-response';

export class SignUpController {
  constructor(
    private readonly signUp: SignUp,
    private readonly httpRequestValidator: HttpRequestValidator<SignUpRequest>,
  ) {}

  async handle(
    request: HttpRequest,
  ): Promise<HttpResponse<Error | SignUpResponse>> {
    const errorOrSignUpRequest = this.httpRequestValidator.validate(request);

    if (errorOrSignUpRequest.isLeft()) {
      const error = errorOrSignUpRequest.value;
      return { statusCode: 400, body: error };
    }

    const signUpRequest = errorOrSignUpRequest.value;
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
