import { HttpController } from '../ports/http-controller';
import { HttpRequest } from '../ports/http-request';
import { HttpRequestParser } from '../ports/http-request-parser';
import { HttpResponse } from '../ports/http-response';
import { HttpRoute } from '../ports/http-route';
import { badRequest, ErrorResponse } from '../utils/http-responses';

export abstract class Controller<T, U> implements HttpController {
  constructor(private readonly httpRequestParser: HttpRequestParser<T>) {}

  abstract get route(): HttpRoute;

  async handle(request: HttpRequest): Promise<HttpResponse<ErrorResponse | U>> {
    const errorOrUseCaseRequest = this.httpRequestParser.parse(request);

    if (errorOrUseCaseRequest.isLeft()) {
      const error = errorOrUseCaseRequest.value;
      const { message, fieldErrors } = error;

      return badRequest({ message, fieldErrors });
    }

    const useCaseRequest = errorOrUseCaseRequest.value;
    return this.execute(useCaseRequest);
  }

  protected abstract execute(
    useCaseRequest: T,
  ): Promise<HttpResponse<ErrorResponse | U>>;
}
