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
  const changePassword = new ChangePassword(
    getTokenService(),
    getUserRepository(),
    getPasswordHasher(),
    await getSessionRepository(),
  );

  const changePasswordHttpRequestParser = new ChangePasswordHttpRequestParser();

  new ChangePasswordController(
    changePassword,
    changePasswordHttpRequestParser,
    getHttpServer(),
  );
}
