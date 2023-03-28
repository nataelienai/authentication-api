import { EmailAlreadyExistsError } from '@/application/errors/email-already-exists-error';
import { SignUp, SignUpRequest } from '@/application/use-cases/sign-up';
import { HttpRequestParser } from '../ports/http-request-parser';
import { HttpResponse } from '../ports/http-response';
import { HttpRoute } from '../ports/http-route';
import {
  badRequest,
  conflict,
  created,
  ErrorResponse,
} from '../utils/http-responses';
import { Controller } from './controller';
import { SessionDto, SessionMapper } from './mappers/session-mapper';
import { UserDto, UserMapper } from './mappers/user-mapper';

type SignUpControllerResponse = {
  user: UserDto;
  session: SessionDto;
};

export class SignUpController extends Controller<
  SignUpRequest,
  SignUpControllerResponse
> {
  private readonly httpRoute: HttpRoute = {
    method: 'post',
    path: '/sign-up',
  };

  constructor(
    private readonly signUp: SignUp,
    httpRequestParser: HttpRequestParser<SignUpRequest>,
  ) {
    super(httpRequestParser);
  }

  get route() {
    return this.httpRoute;
  }

  protected async execute(
    signUpRequest: SignUpRequest,
  ): Promise<HttpResponse<ErrorResponse | SignUpControllerResponse>> {
    const errorOrSignUpResponse = await this.signUp.execute(signUpRequest);

    if (errorOrSignUpResponse.isLeft()) {
      const error = errorOrSignUpResponse.value;

      if (error instanceof EmailAlreadyExistsError) {
        return conflict({ message: error.message });
      }

      return badRequest({ message: error.message });
    }

    const signUpResponse = errorOrSignUpResponse.value;
    const user = UserMapper.mapToDto(signUpResponse.user);
    const session = SessionMapper.mapToDto(signUpResponse.session);

    return created({ user, session });
  }
}
