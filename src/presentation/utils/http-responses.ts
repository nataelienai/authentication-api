import { HttpResponse } from '../ports/http-response';

export type ErrorResponse = {
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export const ok = <T>(data: T): HttpResponse<T> => ({
  statusCode: 200,
  body: data,
});

export const created = <T>(data: T): HttpResponse<T> => ({
  statusCode: 201,
  body: data,
});

export const noContent = <T>(data: T): HttpResponse<T> => ({
  statusCode: 204,
  body: data,
});

export const badRequest = (
  error: ErrorResponse,
): HttpResponse<ErrorResponse> => ({
  statusCode: 400,
  body: error,
});

export const notFound = (
  error: ErrorResponse,
): HttpResponse<ErrorResponse> => ({
  statusCode: 404,
  body: error,
});

export const conflict = (
  error: ErrorResponse,
): HttpResponse<ErrorResponse> => ({
  statusCode: 409,
  body: error,
});
