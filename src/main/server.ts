/* eslint-disable no-console */
import { getSignUpController } from './singletons/sign-up-controller';
import { getSignInController } from './singletons/sign-in-controller';
import { getSignOutController } from './singletons/sign-out-controller';
import { getRefreshAccessTokenController } from './singletons/refresh-access-token-controller';
import { getGetUserController } from './singletons/get-user-controller';
import { getChangeEmailController } from './singletons/change-email-controller';
import { getChangePasswordController } from './singletons/change-password-controller';
import { getDeleteUserController } from './singletons/delete-user-controller';
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
