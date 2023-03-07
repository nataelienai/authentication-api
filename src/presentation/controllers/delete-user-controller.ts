import { UserNotFoundError } from '@/application/errors/user-not-found-error';
import {
  DeleteUser,
  DeleteUserRequest,
} from '@/application/use-cases/delete-user';
import { HttpRequest } from '../ports/http-request';
import { HttpRequestValidator } from '../ports/http-request-validator';
import { HttpResponse } from '../ports/http-response';

export class DeleteUserController {
  constructor(
    private readonly deleteUser: DeleteUser,
    private readonly httpRequestValidator: HttpRequestValidator<DeleteUserRequest>,
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse<Error | void>> {
    const errorOrDeleteUserRequest =
      this.httpRequestValidator.validate(request);

    if (errorOrDeleteUserRequest.isLeft()) {
      const error = errorOrDeleteUserRequest.value;
      return { statusCode: 400, body: error };
    }

    const deleteUserRequest = errorOrDeleteUserRequest.value;
    const errorOrVoid = await this.deleteUser.execute(deleteUserRequest);

    if (errorOrVoid.isLeft()) {
      const error = errorOrVoid.value;

      if (error instanceof UserNotFoundError) {
        return { statusCode: 404, body: error };
      }

      return { statusCode: 400, body: error };
    }

    return { statusCode: 204, body: undefined };
  }
}
