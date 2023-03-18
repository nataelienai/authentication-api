import { ExpressHttpServer } from '@/infra/http/servers/express-http-server';
import { HttpServer } from '@/presentation/ports/http-server';

let httpServer: HttpServer;

export function getHttpServer() {
  if (!httpServer) {
    httpServer = new ExpressHttpServer();
  }
  return httpServer;
}
