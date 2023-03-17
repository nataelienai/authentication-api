/* eslint-disable no-new */
import { GetUser } from '@/application/use-cases/get-user';
import { GetUserHttpRequestParser } from '@/infra/http/parsers/get-user-http-request-parser';
import { GetUserController } from '@/presentation/controllers/get-user-controller';
import { getSessionRepository } from '../repositories/session-repository';
import { getUserRepository } from '../repositories/user-repository';
import { getHttpServer } from '../servers/http-server';
import { getTokenService } from '../services/token-service';

export async function loadGetUserController() {
  const getUser = new GetUser(
    getTokenService(),
    getUserRepository(),
    await getSessionRepository(),
  );

  const getUserHttpRequestParser = new GetUserHttpRequestParser();

  new GetUserController(getUser, getUserHttpRequestParser, getHttpServer());
}
