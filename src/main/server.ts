import { getSignUpController } from './instances/sign-up-controller';
import { getSignInController } from './instances/sign-in-controller';
import { getSignOutController } from './instances/sign-out-controller';
import { getRefreshAccessTokenController } from './instances/refresh-access-token-controller';
import { getGetUserController } from './instances/get-user-controller';
import { getChangeEmailController } from './instances/change-email-controller';
import { getChangePasswordController } from './instances/change-password-controller';
import { getDeleteUserController } from './instances/delete-user-controller';
import { getHttpServer } from './instances/http-server';
import { getLogger } from './instances/logger';
import { env } from './env';

const { PORT } = env;
const logger = getLogger();

async function run() {
  // cannot Promise.all because of concurrent database index creation
  const controllers = [
    await getSignInController(),
    await getSignUpController(),
    await getSignOutController(),
    await getRefreshAccessTokenController(),
    await getGetUserController(),
    await getChangeEmailController(),
    await getChangePasswordController(),
    await getDeleteUserController(),
  ];

  const httpServer = getHttpServer();

  controllers.forEach((controller) => httpServer.register(controller));

  httpServer.listen(PORT, () =>
    logger.info(`HTTP server listening on port ${PORT}`),
  );
}

// eslint-disable-next-line unicorn/prefer-top-level-await
run().catch((error) => {
  logger.error(error);
});

process.on('uncaughtException', (error) => {
  logger.error(error);
});

process.on('unhandledRejection', (reason) => {
  logger.error(reason);
});
