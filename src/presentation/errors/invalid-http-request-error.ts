export class InvalidHttpRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidHttpRequestError';
  }
}
