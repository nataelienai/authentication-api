import { HttpController } from '../ports/http-controller';
import { HttpRequest } from '../ports/http-request';
import { HttpRequestParser } from '../ports/http-request-parser';
import { HttpResponse } from '../ports/http-response';
import { badRequest } from '../utils/http-responses';

export abstract class Controller<T, U> implements HttpController {
  constructor(private readonly httpRequestParser: HttpRequestParser<T>) {}

  async handle(request: HttpRequest): Promise<HttpResponse<Error | U>> {
    const errorOrUseCaseRequest = this.httpRequestParser.parse(request);

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
