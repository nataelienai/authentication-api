import { HttpRequest } from './http-request';
import { HttpResponse } from './http-response';

export interface HttpController {
  handle(httpRequest: HttpRequest): Promise<HttpResponse<unknown>>;
}
