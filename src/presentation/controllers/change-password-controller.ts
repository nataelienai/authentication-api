import { UserNotFoundError } from '@/application/errors/user-not-found-error';
import {
  ChangePassword,
  ChangePasswordRequest,
} from '@/application/use-cases/change-password';
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

type ChangePasswordControllerResponse = {
  user: UserDto;
};

export class ChangePasswordController extends Controller<
  ChangePasswordRequest,
  ChangePasswordControllerResponse
> {
  private readonly httpRoute: HttpRoute = {
    method: 'patch',
    path: '/user/password',
  };

  constructor(
    private readonly changePassword: ChangePassword,
    httpRequestParser: HttpRequestParser<ChangePasswordRequest>,
  ) {
    super(httpRequestParser);
  }

  get route() {
    return this.httpRoute;
  }

  protected async execute(
    changePasswordRequest: ChangePasswordRequest,
  ): Promise<HttpResponse<ErrorResponse | ChangePasswordControllerResponse>> {
    const errorOrChangePasswordResponse = await this.changePassword.execute(
      changePasswordRequest,
    );

    if (errorOrChangePasswordResponse.isLeft()) {
      const error = errorOrChangePasswordResponse.value;

      if (error instanceof UserNotFoundError) {
        return notFound({ message: error.message });
      }

      return badRequest({ message: error.message });
    }

    const changePasswordResponse = errorOrChangePasswordResponse.value;
    const user = UserMapper.mapToDto(changePasswordResponse.user);

    return ok({ user });
  }
}
