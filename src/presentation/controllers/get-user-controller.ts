import { UserNotFoundError } from '@/application/errors/user-not-found-error';
import {
  GetUser,
  GetUserRequest,
  GetUserResponse,
} from '@/application/use-cases/get-user';
import { HttpRequestValidator } from '../ports/http-request-validator';
import { HttpResponse } from '../ports/http-response';
import { Controller } from './controller';

export class GetUserController extends Controller<
  GetUserRequest,
  GetUserResponse
> {
  constructor(
    private readonly getUser: GetUser,
    httpRequestValidator: HttpRequestValidator<GetUserRequest>,
  ) {
    super(httpRequestValidator);
  }

  protected async execute(
    getUserRequest: GetUserRequest,
  ): Promise<HttpResponse<Error | GetUserResponse>> {
    const errorOrGetUserResponse = await this.getUser.execute(getUserRequest);

    if (errorOrGetUserResponse.isLeft()) {
      const error = errorOrGetUserResponse.value;

      if (error instanceof UserNotFoundError) {
        return { statusCode: 404, body: error };
      }

      return { statusCode: 400, body: error };
    }

    const getUserResponse = errorOrGetUserResponse.value;
    return { statusCode: 200, body: getUserResponse };
  }
}
