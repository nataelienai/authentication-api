/* eslint-disable no-console */
import { loadSignUpController } from './loaders/sign-up-controller-loader';
import { loadSignInController } from './loaders/sign-in-controller-loader';
import { loadSignOutController } from './loaders/sign-out-controller-loader';
import { loadRefreshAccessTokenController } from './loaders/refresh-access-token-controller-loader';
import { loadGetUserController } from './loaders/get-user-controller-loader';
import { loadChangeEmailController } from './loaders/change-email-controller-loader';
import { loadChangePasswordController } from './loaders/change-password-controller-loader';
import { loadDeleteUserController } from './loaders/delete-user-controller-loader';
import { getHttpServer } from './singletons/http-server';

async function run() {
  const controllers = await Promise.all([
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

  controllers.forEach((controller) => httpServer.register(controller));

  httpServer.listen(3000);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
