import winston, { createLogger, format, transports } from 'winston';
import { Logger } from './logger';

export class WinstonLogger implements Logger {
  private readonly logger: winston.Logger;

  constructor() {
    const logFormat = format.printf(
      ({ level, message, stack, timestamp }) =>
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        `${timestamp} ${level}: ${stack ?? message}`,
    );

    this.logger = createLogger({
      level: 'info',
      format: format.combine(format.timestamp(), logFormat),
      transports: [new transports.Console()],
    });
  }

  info(message: string): void {
    this.logger.info(message);
  }

  warn(message: string): void;
  warn(error: string): void;
  warn(reason: unknown): void;
  warn(messageOrErrorOrReason: unknown): void {
    this.logger.warn(messageOrErrorOrReason);
  }

  error(message: string): void;
  error(error: Error): void;
  error(reason: unknown): void;
  error(messageOrErrorOrReason: unknown): void {
    this.logger.error(messageOrErrorOrReason);
  }
}
