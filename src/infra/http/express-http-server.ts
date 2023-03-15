import express from 'express';
import cors from 'cors';
import { HttpController } from '@/presentation/ports/http-controller';
import { HttpServer, Method } from '@/presentation/ports/http-server';
import { HttpRequest } from '@/presentation/ports/http-request';

export class ExpressHttpServer implements HttpServer {
  private readonly app: express.Express;

  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.app.use(cors());
  }

  on(method: Method, path: string, controller: HttpController) {
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

  listen(port: number) {
    this.app.listen(port);
  }
}
