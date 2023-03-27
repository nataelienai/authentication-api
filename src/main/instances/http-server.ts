import { ExpressHttpServer } from '@/infra/http/servers/express-http-server';
import { HttpServer } from '@/presentation/ports/http-server';
import { getLogger } from './logger';

let httpServer: HttpServer;

export function getHttpServer() {
  if (!httpServer) {
    httpServer = new ExpressHttpServer(getLogger());
  }
  return httpServer;
}
