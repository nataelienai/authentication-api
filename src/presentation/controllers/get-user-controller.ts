import { UserNotFoundError } from '@/application/errors/user-not-found-error';
import { GetUser, GetUserRequest } from '@/application/use-cases/get-user';
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

type GetUserControllerResponse = {
  user: UserDto;
};

export class GetUserController extends Controller<
  GetUserRequest,
  GetUserControllerResponse
> {
  private readonly httpRoute: HttpRoute = {
    method: 'get',
    path: '/user',
  };

  constructor(
    private readonly getUser: GetUser,
    httpRequestParser: HttpRequestParser<GetUserRequest>,
  ) {
    super(httpRequestParser);
  }

  get route() {
    return this.httpRoute;
  }

  protected async execute(
    getUserRequest: GetUserRequest,
  ): Promise<HttpResponse<ErrorResponse | GetUserControllerResponse>> {
    const errorOrGetUserResponse = await this.getUser.execute(getUserRequest);

    if (errorOrGetUserResponse.isLeft()) {
      const error = errorOrGetUserResponse.value;

      if (error instanceof UserNotFoundError) {
        return notFound({ message: error.message });
      }

      return badRequest({ message: error.message });
    }

    const getUserResponse = errorOrGetUserResponse.value;
    const user = UserMapper.mapToDto(getUserResponse.user);

    return ok({ user });
  }
}
