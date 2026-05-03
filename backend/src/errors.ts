export type FieldErrors = Record<string, string>;

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
    public readonly fieldErrors?: FieldErrors,
  ) {
    super(message);
  }
}

export const isAppError = (error: unknown): error is AppError => error instanceof AppError;

export const validationError = (fieldErrors: FieldErrors): AppError =>
  new AppError(400, "VALIDATION_ERROR", "Submitted values are invalid.", fieldErrors);
