import { UserNotFoundError } from '@/application/errors/user-not-found-error';
import { SignIn, SignInRequest } from '@/application/use-cases/sign-in';
import { HttpRequestParser } from '../ports/http-request-parser';
import { HttpResponse } from '../ports/http-response';
import { HttpRoute } from '../ports/http-route';
import {
  ErrorResponse,
  notFound,
  ok,
  unauthorized,
} from '../utils/http-responses';
import { Controller } from './controller';
import { SessionDto, SessionMapper } from './mappers/session-mapper';
import { UserDto, UserMapper } from './mappers/user-mapper';

type SignInControllerResponse = {
  user: UserDto;
  session: SessionDto;
};

export class SignInController extends Controller<
  SignInRequest,
  SignInControllerResponse
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
  ): Promise<HttpResponse<ErrorResponse | SignInControllerResponse>> {
    const errorOrSignInResponse = await this.signIn.execute(signInRequest);

    if (errorOrSignInResponse.isLeft()) {
      const error = errorOrSignInResponse.value;

      if (error instanceof UserNotFoundError) {
        return notFound({ message: error.message });
      }

      return unauthorized({ message: error.message });
    }

    const signInResponse = errorOrSignInResponse.value;
    const user = UserMapper.mapToDto(signInResponse.user);
    const session = SessionMapper.mapToDto(signInResponse.session);

    return ok({ user, session });
  }
}
