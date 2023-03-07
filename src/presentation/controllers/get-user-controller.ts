import { UserNotFoundError } from '@/application/errors/user-not-found-error';
import {
  GetUser,
  GetUserRequest,
  GetUserResponse,
} from '@/application/use-cases/get-user';
import { HttpRequest } from '../ports/http-request';
import { HttpRequestValidator } from '../ports/http-request-validator';
import { HttpResponse } from '../ports/http-response';

export class GetUserController {
  constructor(
    private readonly getUser: GetUser,
    private readonly httpRequestValidator: HttpRequestValidator<GetUserRequest>,
  ) {}

  async handle(
    request: HttpRequest,
  ): Promise<HttpResponse<Error | GetUserResponse>> {
    const errorOrGetUserRequest = this.httpRequestValidator.validate(request);

    if (errorOrGetUserRequest.isLeft()) {
      const error = errorOrGetUserRequest.value;
      return { statusCode: 400, body: error };
    }

    const getUserRequest = errorOrGetUserRequest.value;
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
