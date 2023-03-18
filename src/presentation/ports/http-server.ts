import { HttpController } from './http-controller';

export interface HttpServer {
  register(controller: HttpController): void;
  listen(port: number): void;
}
