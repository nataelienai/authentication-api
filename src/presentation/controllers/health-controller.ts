import { HttpController } from '../ports/http-controller';
import { HttpResponse } from '../ports/http-response';
import { HttpRoute } from '../ports/http-route';
import { ok } from '../utils/http-responses';

export class HealthController implements HttpController {
  private readonly httpRoute: HttpRoute = {
    method: 'get',
    path: '/health',
  };

  get route(): HttpRoute {
    return this.httpRoute;
  }

  // eslint-disable-next-line class-methods-use-this
  handle(): Promise<HttpResponse<unknown>> {
    return Promise.resolve(ok({ status: 'UP' }));
  }
}
