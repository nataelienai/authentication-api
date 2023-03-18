import { ChangePassword } from '@/application/use-cases/change-password';
import { ChangePasswordHttpRequestParser } from '@/infra/http/parsers/change-password-http-request-parser';
import { ChangePasswordController } from '@/presentation/controllers/change-password-controller';
import { getSessionRepository } from '../singletons/session-repository';
import { getUserRepository } from '../singletons/user-repository';
import { getPasswordHasher } from '../singletons/password-hasher';
import { getTokenService } from '../singletons/token-service';

export async function getChangePasswordController() {
  const [userRepository, sessionRepository] = await Promise.all([
    getUserRepository(),
    getSessionRepository(),
  ]);

  const changePassword = new ChangePassword(
    getTokenService(),
    userRepository,
    getPasswordHasher(),
    sessionRepository,
  );

  const changePasswordHttpRequestParser = new ChangePasswordHttpRequestParser();

  return new ChangePasswordController(
    changePassword,
    changePasswordHttpRequestParser,
  );
}
