import { ChangePassword } from '@/application/use-cases/change-password';
import { ChangePasswordHttpRequestParser } from '@/infra/http/parsers/change-password-http-request-parser';
import { ChangePasswordController } from '@/presentation/controllers/change-password-controller';
import { getUserRepository } from './user-repository';
import { getPasswordHasher } from './password-hasher';
import { getAuth } from './auth';

export async function getChangePasswordController() {
  const [userRepository, auth] = await Promise.all([
    getUserRepository(),
    getAuth(),
  ]);

  const changePassword = new ChangePassword(
    userRepository,
    getPasswordHasher(),
    auth,
  );

  const changePasswordHttpRequestParser = new ChangePasswordHttpRequestParser();

  return new ChangePasswordController(
    changePassword,
    changePasswordHttpRequestParser,
  );
}
