import { HttpRequest } from '../ports/http-request';
import { HttpRequestValidator } from '../ports/http-request-validator';
import { HttpResponse } from '../ports/http-response';

export abstract class Controller<T, U> {
  constructor(private readonly httpRequestValidator: HttpRequestValidator<T>) {}

  async handle(request: HttpRequest): Promise<HttpResponse<Error | U>> {
    const errorOrUseCaseRequest = this.httpRequestValidator.validate(request);

    if (errorOrUseCaseRequest.isLeft()) {
      const error = errorOrUseCaseRequest.value;
      return { statusCode: 400, body: error };
    }

    const useCaseRequest = errorOrUseCaseRequest.value;
    return this.execute(useCaseRequest);
  }

  public abstract execute(useCaseRequest: T): Promise<HttpResponse<Error | U>>;
}
