/* eslint-disable no-new */
import { ChangePassword } from '@/application/use-cases/change-password';
import { ChangePasswordHttpRequestParser } from '@/infra/http/parsers/change-password-http-request-parser';
import { ChangePasswordController } from '@/presentation/controllers/change-password-controller';
import { getSessionRepository } from '../repositories/session-repository';
import { getUserRepository } from '../repositories/user-repository';
import { getHttpServer } from '../servers/http-server';
import { getPasswordHasher } from '../services/password-hasher';
import { getTokenService } from '../services/token-service';

export async function loadChangePasswordController() {
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

  new ChangePasswordController(
    changePassword,
    changePasswordHttpRequestParser,
    getHttpServer(),
  );
}
