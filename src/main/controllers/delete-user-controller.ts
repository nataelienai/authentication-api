/* eslint-disable no-new */
import { DeleteUser } from '@/application/use-cases/delete-user';
import { DeleteUserHttpRequestParser } from '@/infra/http/parsers/delete-user-http-request-parser';
import { DeleteUserController } from '@/presentation/controllers/delete-user-controller';
import { getSessionRepository } from '../repositories/session-repository';
import { getUserRepository } from '../repositories/user-repository';
import { getHttpServer } from '../servers/http-server';
import { getTokenService } from '../services/token-service';

export async function loadDeleteUserController() {
  const deleteUser = new DeleteUser(
    getTokenService(),
    getUserRepository(),
    await getSessionRepository(),
  );

  const deleteUserHttpRequestParser = new DeleteUserHttpRequestParser();

  new DeleteUserController(
    deleteUser,
    deleteUserHttpRequestParser,
    getHttpServer(),
  );
}
