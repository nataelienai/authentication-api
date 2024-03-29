import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import openApiDocument from '@/docs/openapi.json';
import { HttpController } from '@/presentation/ports/http-controller';
import { HttpServer } from '@/presentation/ports/http-server';
import { HttpRequest } from '@/presentation/ports/http-request';
import { internalServerError } from '@/presentation/utils/http-responses';
import { Logger } from '@/infra/logging/logger';

export class ExpressHttpServer implements HttpServer {
  private readonly app: express.Express;

  constructor(private readonly logger: Logger) {
    this.app = express();
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(
      '/api-docs',
      swaggerUi.serve,
      swaggerUi.setup(openApiDocument),
    );
  }

  register(controller: HttpController) {
    const { method, path } = controller.route;

    // rule disabled because an invalid 'method' will already cause TS error
    // eslint-disable-next-line security/detect-object-injection
    this.app[method](path, (request, response) => {
      const httpRequest: HttpRequest = {
        headers: request.headers,
        body: request.body,
      };

      controller
        .handle(httpRequest)
        .then((httpResponse) =>
          response.status(httpResponse.statusCode).json(httpResponse.body),
        )
        .catch((error) => {
          this.logger.warn(error);

          const httpResponse = internalServerError();
          response.status(httpResponse.statusCode).json(httpResponse.body);
        });
    });
  }

  listen(port: number, callback?: () => void) {
    this.app.listen(port, callback);
  }
}
