import { HttpRequest } from './http-request';
import { HttpResponse } from './http-response';
import { HttpRoute } from './http-route';

export interface HttpController {
  get route(): HttpRoute;
  handle(httpRequest: HttpRequest): Promise<HttpResponse<unknown>>;
}
