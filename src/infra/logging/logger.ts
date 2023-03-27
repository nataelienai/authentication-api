export interface Logger {
  info(message: string): void;
  error(message: string): void;
  error(error: Error): void;
  error(reason: unknown): void;
}
