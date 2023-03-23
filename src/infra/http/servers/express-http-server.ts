import express from 'express';
import cors from 'cors';
import { HttpController } from '@/presentation/ports/http-controller';
import { HttpServer } from '@/presentation/ports/http-server';
import { HttpRequest } from '@/presentation/ports/http-request';

export class ExpressHttpServer implements HttpServer {
  private readonly app: express.Express;

  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.app.use(cors());
  }

  register(controller: HttpController) {
    const { method, path } = controller.route;

    // rule disabled because an invalid 'method' will cause typing error
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
        .catch(() =>
          response.status(500).json({ message: 'Internal Server Error' }),
        );
    });
  }

  listen(port: number, callback?: () => void) {
    this.app.listen(port, callback);
  }
}
