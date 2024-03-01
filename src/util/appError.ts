export class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class MissingEnvError extends AppError {
  constructor() {
    super('Missing environment variable.', 500);
  }
}

export class DbError extends AppError {
  constructor(message: string) {
    super(message, 500);
  }
}

export class HelperError extends AppError {
  constructor(message: string) {
    super(message, 500);
  }
}

export class RouteError extends AppError {
  constructor(message: string) {
    super(message, 500);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string) {
    super(message, 403);
  }
}
