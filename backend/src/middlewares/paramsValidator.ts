import { NextFunction, Request, Response } from "express";

import z, { success, ZodSafeParseResult } from "zod";
import { AppError, ParamError } from "../lib/AppError";

type DataSource = "body" | "url";
type ParamType =
  | "number"
  | "string"
  | "email"
  | "dateTime"
  | "object"
  | "other";

interface ParamValidatorType {
  type: ParamType;
  source: DataSource;
  name: string;
}

interface SchemaValidatorType<T> {
  source: DataSource;
  zodSchema: z.ZodType<T>;
}

function paramsValidator(
  p: ParamValidatorType[],
): (req: Request, res: Response, next: NextFunction) => void;

function paramsValidator<T>(
  p: SchemaValidatorType<T>,
): (req: Request, res: Response, next: NextFunction) => void;

function paramsValidator<T>(
  params: ParamValidatorType[] | SchemaValidatorType<T>,
) {
  return function (req: Request, res: Response, next: NextFunction) {
    console.log(req.body);

    if (!("zodSchema" in params)) {
      const errorFields: ParamError[] = [];
      params.forEach((param) => {
        let paramData;
        if (param.source === "body") {
          if (!req.body) {
            throw new AppError("body_empty", 400);
          }
          paramData = req.body[param.name];
        } else {
          if (!req.query) {
            throw new AppError("url_empty", 400);
          }
          paramData = req.query[param.name];
        }

        if (paramData !== undefined) {
          const result = validateParam(paramData, param.type, param.name);

          if (!result.success) {
            if (result.params) {
              errorFields.push(result.params);
            }
          } else {
            if (!res.locals.validatedData) {
              res.locals.validatedData = {
                [param.name]: result.data,
              };
            } else {
              res.locals.validatedData[param.name] = result.data;
            }
          }
        } else {
          errorFields.push({
            code: "empty",
            name: param.name,
          });
        }
      });
      if (errorFields.length > 0) {
        throw new AppError("failed_validation", 400, errorFields);
      }
    } else {
      let paramsToManipulate;
      if (params.source === "body") {
        if (!req.body) {
          throw new AppError("body_empty", 400);
        }
        paramsToManipulate = req.body;
      } else {
        if (!req.query) {
          throw new AppError("url_empty", 400);
        }
        paramsToManipulate = req.query;
      }

      const data = params.zodSchema.safeParse(paramsToManipulate);

      if (data.success) {
        res.locals.validatedData = {
          ...res.locals.validatedData,
          ...data.data,
        };
      } else {
        const errorFields: ParamError[] = [];
        data.error.issues.forEach((issue) => {
          if (/undefined/gi.test(issue.message)) {
            errorFields.push({
              code: "empty",
              name: issue.path[0].toString(),
            });
            return;
          }

          const expected = "expected" in issue ? String(issue.expected) : null;
          const received = "received" in issue ? String(issue.received) : null;

          errorFields.push({
            name: issue.path[0].toString(),
            code: issue.code,
            ...((expected !== null || received !== null) && {
              params: {
                ...(expected !== null && { expected: expected }),
                ...(received !== null && { received: received }),
              },
            }),
          });
        });

        throw new AppError("failed_validation", 400, errorFields);
      }
    }

    next();
  };
}

export default paramsValidator;

function formatValidationResult(
  result: ZodSafeParseResult<unknown>,
  name: string,
): {
  success: boolean;
  data?: any;
  params?: ParamError;
} {
  if (result.success) {
    return { success: true, data: result.data };
  }

  const issue = result.error.issues[0];

  const expected = "expected" in issue ? String(issue.expected) : null;
  const received = "received" in issue ? String(issue.received) : null;

  return {
    success: false,
    params: {
      code: issue.code,
      name: name,
      ...((expected !== null || received !== null) && {
        params: {
          ...(expected !== null && { expected: expected }),
          ...(received !== null && { received: received }),
        },
      }),
    },
  };
}

function validateParam(param: unknown, type: ParamType, name: string) {
  switch (type) {
    case "string":
      return formatValidationResult(z.string().trim().safeParse(param), name);

    case "number":
      const isString = typeof param === "string";
      const isNumber = typeof param === "number";
      let number = isString ? parseFloat(param) : isNumber ? param : null;

      if (param === null || param === undefined) {
        return { success: false, data: param };
      }

      return formatValidationResult(z.number().safeParse(number), name);

    case "email":
      return formatValidationResult(z.email().safeParse(param), name);

    case "dateTime":
      return formatValidationResult(z.iso.datetime().safeParse(param), name);

    case "object": {
      const isObject =
        typeof param === "object" && param !== null && !Array.isArray(param);

      if (isObject) {
        return { success: true, data: param };
      }

      const receivedType =
        param === null ? "null" : Array.isArray(param) ? "array" : typeof param;

      return {
        success: false,
        params: {
          code: "invalid_type",
          name: name,
          params: {
            expected: "object",
            received: receivedType,
          },
        },
      };
    }

    default:
      return {
        success: false as const,
        params: { code: "unsupported_type", name, params: {} },
      };
  }
}
