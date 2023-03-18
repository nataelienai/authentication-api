/* eslint-disable no-console */
import { getSignUpController } from './loaders/sign-up-controller-loader';
import { getSignInController } from './loaders/sign-in-controller-loader';
import { getSignOutController } from './loaders/sign-out-controller-loader';
import { getRefreshAccessTokenController } from './loaders/refresh-access-token-controller-loader';
import { getGetUserController } from './loaders/get-user-controller-loader';
import { getChangeEmailController } from './loaders/change-email-controller-loader';
import { getChangePasswordController } from './loaders/change-password-controller-loader';
import { getDeleteUserController } from './loaders/delete-user-controller-loader';
import { getHttpServer } from './singletons/http-server';

async function run() {
  const controllers = await Promise.all([
    getSignInController(),
    getSignUpController(),
    getSignOutController(),
    getRefreshAccessTokenController(),
    getGetUserController(),
    getChangeEmailController(),
    getChangePasswordController(),
    getDeleteUserController(),
  ]);

  const httpServer = getHttpServer();

  controllers.forEach((controller) => httpServer.register(controller));

  httpServer.listen(3000);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
