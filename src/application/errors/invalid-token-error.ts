export class InvalidTokenError extends Error {
  constructor() {
    super('The provided token is invalid');
    this.name = 'InvalidTokenError';
  }
}
