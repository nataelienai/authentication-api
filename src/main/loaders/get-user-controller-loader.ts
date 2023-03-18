import { GetUser } from '@/application/use-cases/get-user';
import { GetUserHttpRequestParser } from '@/infra/http/parsers/get-user-http-request-parser';
import { GetUserController } from '@/presentation/controllers/get-user-controller';
import { getSessionRepository } from '../singletons/session-repository';
import { getUserRepository } from '../singletons/user-repository';
import { getTokenService } from '../singletons/token-service';

export async function getGetUserController() {
  const [userRepository, sessionRepository] = await Promise.all([
    getUserRepository(),
    getSessionRepository(),
  ]);

  const getUser = new GetUser(
    getTokenService(),
    userRepository,
    sessionRepository,
  );

  const getUserHttpRequestParser = new GetUserHttpRequestParser();

  return new GetUserController(getUser, getUserHttpRequestParser);
}
