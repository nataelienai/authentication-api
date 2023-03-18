/* eslint-disable no-new */
import { ChangePassword } from '@/application/use-cases/change-password';
import { ChangePasswordHttpRequestParser } from '@/infra/http/parsers/change-password-http-request-parser';
import { ChangePasswordController } from '@/presentation/controllers/change-password-controller';
import { getSessionRepository } from '../singletons/session-repository';
import { getUserRepository } from '../singletons/user-repository';
import { getHttpServer } from '../singletons/http-server';
import { getPasswordHasher } from '../singletons/password-hasher';
import { getTokenService } from '../singletons/token-service';

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

  const httpServer = getHttpServer();
  const controller = new ChangePasswordController(
    changePassword,
    changePasswordHttpRequestParser,
  );

  httpServer.register(controller);
}
