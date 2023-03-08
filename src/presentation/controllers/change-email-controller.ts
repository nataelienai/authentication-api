import { UserNotFoundError } from '@/application/errors/user-not-found-error';
import {
  ChangeEmail,
  ChangeEmailRequest,
  ChangeEmailResponse,
} from '@/application/use-cases/change-email';
import { HttpRequestValidator } from '../ports/http-request-validator';
import { HttpResponse } from '../ports/http-response';
import { HttpServer } from '../ports/http-server';
import { badRequest, notFound, ok } from '../utils/http-responses';
import { Controller } from './controller';

export class ChangeEmailController extends Controller<
  ChangeEmailRequest,
  ChangeEmailResponse
> {
  constructor(
    private readonly changeEmail: ChangeEmail,
    httpRequestValidator: HttpRequestValidator<ChangeEmailRequest>,
    httpServer: HttpServer,
  ) {
    super(httpRequestValidator);
    httpServer.on('patch', '/user/email', this);
  }

  protected async execute(
    changeEmailRequest: ChangeEmailRequest,
  ): Promise<HttpResponse<Error | ChangeEmailResponse>> {
    const errorOrChangeEmailResponse = await this.changeEmail.execute(
      changeEmailRequest,
    );

    if (errorOrChangeEmailResponse.isLeft()) {
      const error = errorOrChangeEmailResponse.value;

      if (error instanceof UserNotFoundError) {
        return notFound(error);
      }

      return badRequest(error);
    }

    const changeEmailResponse = errorOrChangeEmailResponse.value;
    return ok(changeEmailResponse);
  }
}
