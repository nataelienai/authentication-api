export interface Logger {
  info(message: string): void;
  warn(message: string): void;
  warn(error: string): void;
  warn(reason: unknown): void;
  error(message: string): void;
  error(error: Error): void;
  error(reason: unknown): void;
}
