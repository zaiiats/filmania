import type { NextFunction, Request, Response } from "express";
import { AppError } from "../lib/AppError.ts";

export default function errorController(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let errorMessage = "unknown_error";
  let errorStatusCode = 500;
  let paramsErrors = null;

  if (err instanceof AppError) {
    errorMessage = err.message;
    errorStatusCode = err.statusCode;
    paramsErrors = err.paramsErrors;
  } else {
    if (err && typeof err === "object" && "message" in err && err.message) {
      errorMessage = err.message;
    }
    if (
      err &&
      typeof err === "object" &&
      "statusCode" in err &&
      err.statusCode
    ) {
      errorStatusCode = err.statusCode;
    }
  }

  console.log(paramsErrors?.length);

  res.status(errorStatusCode).json({
    status: getStatusFromErrorStatusCode(errorStatusCode),
    message: errorMessage,
    ...(paramsErrors !== null &&
      paramsErrors.length > 0 && { params: paramsErrors }),
  });
}

function getStatusFromErrorStatusCode(statusCode: number) {
  return statusCode.toString().startsWith("4") ? "fail" : "error";
}
