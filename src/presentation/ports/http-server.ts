import { HttpController } from './http-controller';

type Method = 'get' | 'post' | 'put' | 'patch' | 'delete';

export interface HttpServer {
  on(method: Method, path: string, controller: HttpController): void;
  listen(port: number): void;
}
