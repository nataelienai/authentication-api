import { UserNotFoundError } from '@/application/errors/user-not-found-error';
import {
  DeleteUser,
  DeleteUserRequest,
} from '@/application/use-cases/delete-user';
import { HttpRequestValidator } from '../ports/http-request-validator';
import { HttpResponse } from '../ports/http-response';
import { Controller } from './controller';

export class DeleteUserController extends Controller<DeleteUserRequest, void> {
  constructor(
    private readonly deleteUser: DeleteUser,
    httpRequestValidator: HttpRequestValidator<DeleteUserRequest>,
  ) {
    super(httpRequestValidator);
  }

  async execute(
    deleteUserRequest: DeleteUserRequest,
  ): Promise<HttpResponse<Error | void>> {
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
