/* eslint-disable no-console */
import { loadSignUpController } from './loaders/sign-up-controller';
import { loadSignInController } from './loaders/sign-in-controller';
import { loadSignOutController } from './loaders/sign-out-controller';
import { loadRefreshAccessTokenController } from './loaders/refresh-access-token-controller';
import { loadGetUserController } from './loaders/get-user-controller';
import { loadChangeEmailController } from './loaders/change-email-controller';
import { loadChangePasswordController } from './loaders/change-password-controller';
import { loadDeleteUserController } from './loaders/delete-user-controller';
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
