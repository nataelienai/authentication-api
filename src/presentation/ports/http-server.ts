import { HttpController } from './http-controller';

export interface HttpServer {
  on(method: string, path: string, controller: HttpController): void;
  listen(port: number): void;
}
