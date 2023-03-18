/* eslint-disable no-new */
import { DeleteUser } from '@/application/use-cases/delete-user';
import { DeleteUserHttpRequestParser } from '@/infra/http/parsers/delete-user-http-request-parser';
import { DeleteUserController } from '@/presentation/controllers/delete-user-controller';
import { getSessionRepository } from '../singletons/session-repository';
import { getUserRepository } from '../singletons/user-repository';
import { getHttpServer } from '../singletons/http-server';
import { getTokenService } from '../singletons/token-service';

export async function loadDeleteUserController() {
  const [userRepository, sessionRepository] = await Promise.all([
    getUserRepository(),
    getSessionRepository(),
  ]);

  const deleteUser = new DeleteUser(
    getTokenService(),
    userRepository,
    sessionRepository,
  );

  const deleteUserHttpRequestParser = new DeleteUserHttpRequestParser();

  const httpServer = getHttpServer();
  const controller = new DeleteUserController(
    deleteUser,
    deleteUserHttpRequestParser,
    httpServer,
  );

  httpServer.register(controller);
}
