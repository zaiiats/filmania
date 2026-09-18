import type { NextFunction, Request, Response } from "express";
import { AppError } from "../lib/AppError.ts";

interface AsyncDataCatch<T> {
  data?: T;
  status?: number;
  totalItems?: number;
}

export function asyncCatcher<T>(
  fn: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<AsyncDataCatch<T> | void | NextFunction>,
) {
  return async function (
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      if (response.headersSent) {
        return;
      }

      const result = await fn(request, response, next);

      if (typeof result === "function") {
        return next();
      }

      if (response.headersSent) {
        return;
      }

      if (!result) {
        response.status(204).end();
        return;
      }

      const { data, totalItems, status = 200 } = result;

      response.status(status).json({
        status: "success",
        data: data ?? null,
        ...(totalItems !== undefined && { totalItems }),
      });
    } catch (error) {
      if (error instanceof AppError) {
        next(error);
      } else {
        const errorMessage =
          error instanceof Error ? error.message : "unexpected_error";
        const errorCode =
          error && typeof error === "object" && "statusCode" in error
            ? (error.statusCode as number)
            : 500;

        next(new AppError(errorMessage, errorCode));
      }
    }
  };
}
