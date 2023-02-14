export class InvalidTimestampsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidTimestampsError';
  }
}
