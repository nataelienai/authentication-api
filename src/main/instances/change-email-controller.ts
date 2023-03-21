import { ChangeEmail } from '@/application/use-cases/change-email';
import { ChangeEmailHttpRequestParser } from '@/infra/http/parsers/change-email-http-request-parser';
import { ChangeEmailController } from '@/presentation/controllers/change-email-controller';
import { getUserRepository } from './user-repository';
import { getAuth } from './auth';

export async function getChangeEmailController() {
  const [userRepository, auth] = await Promise.all([
    getUserRepository(),
    getAuth(),
  ]);

  const changeEmail = new ChangeEmail(userRepository, auth);

  const changeEmailHttpRequestParser = new ChangeEmailHttpRequestParser();

  return new ChangeEmailController(changeEmail, changeEmailHttpRequestParser);
}
