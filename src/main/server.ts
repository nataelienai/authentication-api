/* eslint-disable no-console */
import { getSignUpController } from './instances/sign-up-controller';
import { getSignInController } from './instances/sign-in-controller';
import { getSignOutController } from './instances/sign-out-controller';
import { getRefreshAccessTokenController } from './instances/refresh-access-token-controller';
import { getGetUserController } from './instances/get-user-controller';
import { getChangeEmailController } from './instances/change-email-controller';
import { getChangePasswordController } from './instances/change-password-controller';
import { getDeleteUserController } from './instances/delete-user-controller';
import { getHttpServer } from './instances/http-server';

const PORT = 3000;

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

  httpServer.listen(PORT, () =>
    console.log(`HTTP server listening on port ${PORT}`),
  );
}

// eslint-disable-next-line unicorn/prefer-top-level-await
run().catch(console.error);
