import { UserNotFoundError } from '@/application/errors/user-not-found-error';
import {
  GetUser,
  GetUserRequest,
  GetUserResponse,
} from '@/application/use-cases/get-user';
import { Either } from '@/shared/either';
import { InvalidHttpRequestError } from '../errors/invalid-http-request-error';

type HttpRequest = {
  body: unknown;
};

type HttpResponse = {
  statusCode: number;
  body: GetUserResponse | Error;
};

interface HttpRequestValidator {
  validate(
    request: HttpRequest,
  ): Either<InvalidHttpRequestError, GetUserRequest>;
}

export class GetUserController {
  constructor(
    private readonly getUser: GetUser,
    private readonly httpRequestValidator: HttpRequestValidator,
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
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
