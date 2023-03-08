import { HttpController } from '../ports/http-controller';
import { HttpRequest } from '../ports/http-request';
import { HttpRequestValidator } from '../ports/http-request-validator';
import { HttpResponse } from '../ports/http-response';
import { badRequest } from '../utils/http-responses';

export abstract class Controller<T, U> implements HttpController {
  constructor(private readonly httpRequestValidator: HttpRequestValidator<T>) {}

  async handle(request: HttpRequest): Promise<HttpResponse<Error | U>> {
    const errorOrUseCaseRequest = this.httpRequestValidator.validate(request);

    if (errorOrUseCaseRequest.isLeft()) {
      const error = errorOrUseCaseRequest.value;
      return badRequest(error);
    }

    const useCaseRequest = errorOrUseCaseRequest.value;
    return this.execute(useCaseRequest);
  }

  protected abstract execute(
    useCaseRequest: T,
  ): Promise<HttpResponse<Error | U>>;
}
