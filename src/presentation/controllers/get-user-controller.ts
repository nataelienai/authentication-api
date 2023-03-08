import { UserNotFoundError } from '@/application/errors/user-not-found-error';
import {
  GetUser,
  GetUserRequest,
  GetUserResponse,
} from '@/application/use-cases/get-user';
import { HttpRequestValidator } from '../ports/http-request-validator';
import { HttpResponse } from '../ports/http-response';
import { HttpServer } from '../ports/http-server';
import { badRequest, notFound, ok } from '../utils/http-responses';
import { Controller } from './controller';

export class GetUserController extends Controller<
  GetUserRequest,
  GetUserResponse
> {
  constructor(
    private readonly getUser: GetUser,
    httpRequestValidator: HttpRequestValidator<GetUserRequest>,
    httpServer: HttpServer,
  ) {
    super(httpRequestValidator);
    httpServer.on('get', '/user', this);
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
