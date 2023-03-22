export class InvalidHttpRequestError extends Error {
  public readonly fieldErrors: Record<string, string[]>;

  constructor(message: string, fieldErrors: Record<string, string[]>) {
    super(message);
    this.name = 'InvalidHttpRequestError';
    this.fieldErrors = fieldErrors;
  }
}
