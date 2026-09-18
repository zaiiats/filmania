export interface ParamError {
  code: string;
  name: string;
  params?: Record<string, unknown>;
}

export class AppError extends Error {
  statusCode: number;
  paramsErrors: ParamError[] | null = null;

  constructor(
    message: string,
    statusCode: number,
    paramsErrors?: ParamError[] | null,
  ) {
    super(message);
    this.statusCode = statusCode;
    if (paramsErrors) {
      this.paramsErrors = paramsErrors;
    }

    Error.captureStackTrace(this, this.constructor);
  }
}
