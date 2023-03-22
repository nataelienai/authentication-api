import { UserNotFoundError } from '@/application/errors/user-not-found-error';
import {
  DeleteUser,
  DeleteUserRequest,
} from '@/application/use-cases/delete-user';
import { HttpRequestParser } from '../ports/http-request-parser';
import { HttpResponse } from '../ports/http-response';
import { HttpRoute } from '../ports/http-route';
import {
  badRequest,
  ErrorResponse,
  noContent,
  notFound,
} from '../utils/http-responses';
import { Controller } from './controller';

export class DeleteUserController extends Controller<DeleteUserRequest, void> {
  private readonly httpRoute: HttpRoute = {
    method: 'delete',
    path: '/user',
  };

  constructor(
    private readonly deleteUser: DeleteUser,
    httpRequestParser: HttpRequestParser<DeleteUserRequest>,
  ) {
    super(httpRequestParser);
  }

  get route() {
    return this.httpRoute;
  }

  protected async execute(
    deleteUserRequest: DeleteUserRequest,
  ): Promise<HttpResponse<ErrorResponse | void>> {
    const errorOrVoid = await this.deleteUser.execute(deleteUserRequest);

    if (errorOrVoid.isLeft()) {
      const error = errorOrVoid.value;

      if (error instanceof UserNotFoundError) {
        return notFound({ message: error.message });
      }

      return badRequest({ message: error.message });
    }

    return noContent(undefined);
  }
}
