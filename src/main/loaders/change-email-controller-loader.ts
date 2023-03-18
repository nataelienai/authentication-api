/* eslint-disable no-new */
import { ChangeEmail } from '@/application/use-cases/change-email';
import { ChangeEmailHttpRequestParser } from '@/infra/http/parsers/change-email-http-request-parser';
import { ChangeEmailController } from '@/presentation/controllers/change-email-controller';
import { getSessionRepository } from '../singletons/session-repository';
import { getUserRepository } from '../singletons/user-repository';
import { getHttpServer } from '../singletons/http-server';
import { getTokenService } from '../singletons/token-service';

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

  const httpServer = getHttpServer();
  const controller = new ChangeEmailController(
    changeEmail,
    changeEmailHttpRequestParser,
  );

  httpServer.register(controller);
}
