import { UserNotFoundError } from '@/application/errors/user-not-found-error';
import {
  ChangeEmail,
  ChangeEmailRequest,
} from '@/application/use-cases/change-email';
import { HttpRequestParser } from '../ports/http-request-parser';
import { HttpResponse } from '../ports/http-response';
import { HttpRoute } from '../ports/http-route';
import {
  badRequest,
  ErrorResponse,
  notFound,
  ok,
} from '../utils/http-responses';
import { Controller } from './controller';
import { UserDto, UserMapper } from './mappers/user-mapper';

type ChangeEmailControllerResponse = {
  user: UserDto;
};

export class ChangeEmailController extends Controller<
  ChangeEmailRequest,
  ChangeEmailControllerResponse
> {
  private readonly httpRoute: HttpRoute = {
    method: 'patch',
    path: '/user/email',
  };

  constructor(
    private readonly changeEmail: ChangeEmail,
    httpRequestParser: HttpRequestParser<ChangeEmailRequest>,
  ) {
    super(httpRequestParser);
  }

  get route() {
    return this.httpRoute;
  }

  protected async execute(
    changeEmailRequest: ChangeEmailRequest,
  ): Promise<HttpResponse<ErrorResponse | ChangeEmailControllerResponse>> {
    const errorOrChangeEmailResponse = await this.changeEmail.execute(
      changeEmailRequest,
    );

    if (errorOrChangeEmailResponse.isLeft()) {
      const error = errorOrChangeEmailResponse.value;

      if (error instanceof UserNotFoundError) {
        return notFound({ message: error.message });
      }

      return badRequest({ message: error.message });
    }

    const changeEmailResponse = errorOrChangeEmailResponse.value;
    const user = UserMapper.mapToDto(changeEmailResponse.user);

    return ok({ user });
  }
}
