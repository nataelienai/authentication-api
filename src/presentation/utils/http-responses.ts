import { HttpResponse } from '../ports/http-response';

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

export const badRequest = <T>(error: T): HttpResponse<T> => ({
  statusCode: 400,
  body: error,
});

export const notFound = <T>(error: T): HttpResponse<T> => ({
  statusCode: 404,
  body: error,
});

export const conflict = <T>(error: T): HttpResponse<T> => ({
  statusCode: 409,
  body: error,
});
