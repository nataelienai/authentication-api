import { UserNotFoundError } from '@/application/errors/user-not-found-error';
import {
  GetUser,
  GetUserRequest,
  GetUserResponse,
} from '@/application/use-cases/get-user';
import { HttpRequestParser } from '../ports/http-request-parser';
import { HttpResponse } from '../ports/http-response';
import { HttpRoute } from '../ports/http-route';
import { HttpServer } from '../ports/http-server';
import { badRequest, notFound, ok } from '../utils/http-responses';
import { Controller } from './controller';

export class GetUserController extends Controller<
  GetUserRequest,
  GetUserResponse
> {
  private readonly httpRoute: HttpRoute = {
    method: 'get',
    path: '/user',
  };

  constructor(
    private readonly getUser: GetUser,
    httpRequestParser: HttpRequestParser<GetUserRequest>,
    httpServer: HttpServer,
  ) {
    super(httpRequestParser);
    httpServer.on('get', '/user', this);
  }

  get route() {
    return this.httpRoute;
  }

  protected async execute(
    getUserRequest: GetUserRequest,
  ): Promise<HttpResponse<Error | GetUserResponse>> {
    const errorOrGetUserResponse = await this.getUser.execute(getUserRequest);

    if (errorOrGetUserResponse.isLeft()) {
      const error = errorOrGetUserResponse.value;

      if (error instanceof UserNotFoundError) {
        return notFound(error);
      }

      return badRequest(error);
    }

    const getUserResponse = errorOrGetUserResponse.value;
    return ok(getUserResponse);
  }
}
