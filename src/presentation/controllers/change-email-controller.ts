import { InvalidTokenError } from '@/application/errors/invalid-token-error';
import { UserNotFoundError } from '@/application/errors/user-not-found-error';
import {
  ChangeEmail,
  ChangeEmailRequest,
} from '@/application/use-cases/change-email';
import { HttpRequestParser } from '../ports/http-request-parser';
import { HttpResponse } from '../ports/http-response';
import { HttpRoute } from '../ports/http-route';
import {
  badRequest,
  ErrorResponse,
  noContent,
  notFound,
  unauthorized,
} from '../utils/http-responses';
import { Controller } from './controller';

export class ChangeEmailController extends Controller<
  ChangeEmailRequest,
  void
> {
  private readonly httpRoute: HttpRoute = {
    method: 'patch',
    path: '/user/email',
  };

  constructor(
    private readonly changeEmail: ChangeEmail,
    httpRequestParser: HttpRequestParser<ChangeEmailRequest>,
  ) {
    super(httpRequestParser);
  }

  get route() {
    return this.httpRoute;
  }

  protected async execute(
    changeEmailRequest: ChangeEmailRequest,
  ): Promise<HttpResponse<ErrorResponse | void>> {
    const errorOrChangeEmailResponse = await this.changeEmail.execute(
      changeEmailRequest,
    );

    if (errorOrChangeEmailResponse.isLeft()) {
      const error = errorOrChangeEmailResponse.value;

      if (error instanceof UserNotFoundError) {
        return notFound({ message: error.message });
      }

      if (error instanceof InvalidTokenError) {
        return unauthorized({ message: error.message });
      }

      return badRequest({ message: error.message });
    }

    return noContent();
  }
}
