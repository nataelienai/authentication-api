/* eslint-disable no-new */
import { ChangeEmail } from '@/application/use-cases/change-email';
import { ChangeEmailHttpRequestParser } from '@/infra/http/parsers/change-email-http-request-parser';
import { ChangeEmailController } from '@/presentation/controllers/change-email-controller';
import { getSessionRepository } from '../repositories/session-repository';
import { getUserRepository } from '../repositories/user-repository';
import { getHttpServer } from '../servers/http-server';
import { getTokenService } from '../services/token-service';

export async function loadChangeEmailController() {
  const [userRepository, sessionRepository] = await Promise.all([
    getUserRepository(),
    getSessionRepository(),
  ]);

  const changeEmail = new ChangeEmail(
    getTokenService(),
    userRepository,
    sessionRepository,
  );

  const changeEmailHttpRequestParser = new ChangeEmailHttpRequestParser();

  new ChangeEmailController(
    changeEmail,
    changeEmailHttpRequestParser,
    getHttpServer(),
  );
}
