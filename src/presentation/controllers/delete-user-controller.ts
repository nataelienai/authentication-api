import { UserNotFoundError } from '@/application/errors/user-not-found-error';
import {
  DeleteUser,
  DeleteUserRequest,
} from '@/application/use-cases/delete-user';
import { HttpRequestValidator } from '../ports/http-request-validator';
import { HttpResponse } from '../ports/http-response';
import { HttpServer } from '../ports/http-server';
import { badRequest, noContent, notFound } from '../utils/http-responses';
import { Controller } from './controller';

export class DeleteUserController extends Controller<DeleteUserRequest, void> {
  constructor(
    private readonly deleteUser: DeleteUser,
    httpRequestValidator: HttpRequestValidator<DeleteUserRequest>,
    httpServer: HttpServer,
  ) {
    super(httpRequestValidator);
    httpServer.on('delete', '/user', this);
  }

  protected async execute(
    deleteUserRequest: DeleteUserRequest,
  ): Promise<HttpResponse<Error | void>> {
    const errorOrVoid = await this.deleteUser.execute(deleteUserRequest);

    if (errorOrVoid.isLeft()) {
      const error = errorOrVoid.value;

      if (error instanceof UserNotFoundError) {
        return notFound(error);
      }

      return badRequest(error);
    }

    return noContent(undefined);
  }
}
