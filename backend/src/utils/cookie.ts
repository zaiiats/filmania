import { Request, Response } from "express";
import { generateUUID } from "./crypto";
import { REFRESH_TOKEN_MAX_AGE_DAYS } from "./tokens";
import { AppError } from "../lib/AppError";

const REFRESH_TOKEN_MAX_AGE = REFRESH_TOKEN_MAX_AGE_DAYS * 24 * 60 * 60 * 1000;

function createCookieOptions(isSaved: boolean, httpOnly: boolean) {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: httpOnly,
    path: "/",
    sameSite: "lax" as const,
    secure: isProduction,
    ...(isSaved && { maxAge: REFRESH_TOKEN_MAX_AGE }),
  };
}

export function setAuthCookies(
  response: Response,
  {
    refreshToken,
    isSaved,
  }: {
    refreshToken: string;
    isSaved: boolean;
  },
) {
  response.cookie("refresh", refreshToken, createCookieOptions(isSaved, true));

  const csrfToken = generateUUID();

  response.cookie("csrf_token", csrfToken, createCookieOptions(isSaved, false));
}

export function clearAuthCookies(response: Response) {
  response.clearCookie("refresh", createCookieOptions(false, true));
  response.clearCookie("csrf_token", createCookieOptions(false, false));
}

export function validateCookies(req: Request) {
  const { refresh, x_csrf_token: csrf_token } = req.cookies;

  if (!refresh) {
    throw new AppError("no_refresh", 400);
  }

  const csrfHeadersValue = req.headers["x-csrf-token"];

  if (csrf_token !== csrfHeadersValue) {
    throw new AppError("no_csrf", 400);
  }

  return { refresh };
}
