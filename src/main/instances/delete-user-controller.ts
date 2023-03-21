import { DeleteUser } from '@/application/use-cases/delete-user';
import { DeleteUserHttpRequestParser } from '@/infra/http/parsers/delete-user-http-request-parser';
import { DeleteUserController } from '@/presentation/controllers/delete-user-controller';
import { getUserRepository } from './user-repository';
import { getAuth } from './auth';

export async function getDeleteUserController() {
  const [userRepository, auth] = await Promise.all([
    getUserRepository(),
    getAuth(),
  ]);

  const deleteUser = new DeleteUser(userRepository, auth);

  const deleteUserHttpRequestParser = new DeleteUserHttpRequestParser();

  return new DeleteUserController(deleteUser, deleteUserHttpRequestParser);
}
