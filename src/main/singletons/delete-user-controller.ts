import { DeleteUser } from '@/application/use-cases/delete-user';
import { DeleteUserHttpRequestParser } from '@/infra/http/parsers/delete-user-http-request-parser';
import { DeleteUserController } from '@/presentation/controllers/delete-user-controller';
import { getSessionRepository } from './session-repository';
import { getUserRepository } from './user-repository';
import { getTokenService } from './token-service';

export async function getDeleteUserController() {
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

  return new DeleteUserController(deleteUser, deleteUserHttpRequestParser);
}
