/* eslint-disable no-console */
import { loadSignUpController } from './controllers/sign-up-controller';
import { loadSignInController } from './controllers/sign-in-controller';
import { loadSignOutController } from './controllers/sign-out-controller';
import { loadRefreshAccessTokenController } from './controllers/refresh-access-token-controller';
import { loadGetUserController } from './controllers/get-user-controller';
import { loadChangeEmailController } from './controllers/change-email-controller';
import { loadChangePasswordController } from './controllers/change-password-controller';
import { loadDeleteUserController } from './controllers/delete-user-controller';
import { getHttpServer } from './servers/http-server';

async function run() {
  await Promise.all([
    loadSignInController(),
    loadSignUpController(),
    loadSignOutController(),
    loadRefreshAccessTokenController(),
    loadGetUserController(),
    loadChangeEmailController(),
    loadChangePasswordController(),
    loadDeleteUserController(),
  ]);

  const httpServer = getHttpServer();
  httpServer.listen(3000);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
