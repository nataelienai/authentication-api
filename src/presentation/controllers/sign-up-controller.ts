import { EmailAlreadyExistsError } from '@/application/errors/email-already-exists-error';
import {
  SignUp,
  SignUpRequest,
  SignUpResponse,
} from '@/application/use-cases/sign-up';
import { Either } from '@/shared/either';
import { InvalidHttpRequestError } from '../errors/invalid-http-request-error';

type HttpRequest = {
  body: unknown;
};

type HttpResponse = {
  statusCode: number;
  body: SignUpResponse | Error;
};

interface HttpRequestValidator {
  validate(
    request: HttpRequest,
  ): Either<InvalidHttpRequestError, SignUpRequest>;
}

export class SignUpController {
  constructor(
    private readonly signUp: SignUp,
    private readonly httpRequestValidator: HttpRequestValidator,
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
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
