import { Logger } from '@/infra/logging/logger';
import { WinstonLogger } from '@/infra/logging/winston-logger';

let logger: Logger;

export function getLogger() {
  if (!logger) {
    logger = new WinstonLogger();
  }

  return logger;
}
