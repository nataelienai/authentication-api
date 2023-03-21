import { GetUser } from '@/application/use-cases/get-user';
import { GetUserHttpRequestParser } from '@/infra/http/parsers/get-user-http-request-parser';
import { GetUserController } from '@/presentation/controllers/get-user-controller';
import { getUserRepository } from './user-repository';
import { getAuth } from './auth';

export async function getGetUserController() {
  const [userRepository, auth] = await Promise.all([
    getUserRepository(),
    getAuth(),
  ]);

  const getUser = new GetUser(userRepository, auth);

  const getUserHttpRequestParser = new GetUserHttpRequestParser();

  return new GetUserController(getUser, getUserHttpRequestParser);
}
