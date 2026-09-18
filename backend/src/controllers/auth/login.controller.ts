import type { Request, Response } from "express";
import { asyncCatcher } from "../../utils/asyncCatcher.ts";
import { validateHashPassword } from "../../utils/crypto.ts";
import { UserLoginType } from "../../utils/validation.ts";
import { prismaInstance } from "../../lib/prisma.ts";
import { AppError } from "../../lib/AppError.ts";
import { setAuthCookies } from "../../utils/cookie.ts";
import { createAccessToken, createRefresh } from "../../utils/tokens.ts";

export const loginController = asyncCatcher(
  async (request: Request, response: Response) => {
    const { username, password, isSaved } = response.locals
      .validatedData as UserLoginType;

    const user = await prismaInstance.user.findUnique({
      where: {
        username: username,
      },
      select: {
        id: true,
        email: true,
        profilePicture: true,
        username: true,
        auth: {
          select: {
            password_hash: true,
            email_verified: true,
          },
        },
      },
    });

    if (!user || !user.auth) {
      throw new AppError("invalid_credentials", 400);
    }

    if (!user.auth.email_verified) {
      throw new AppError("email_not_verified", 409);
    }

    const isPasswordOk = await validateHashPassword(
      password,
      user.auth.password_hash,
    );

    if (!isPasswordOk) {
      throw new AppError("invalid_credentials", 400);
    }

    const { refreshHash, expiresAt, refreshToken } = createRefresh();

    const session = await prismaInstance.session.create({
      data: {
        user_id: user.id,
        token_hash: refreshHash,
        expires_at: expiresAt,
        is_persistent: isSaved,
        ip_address: request.ip || null,
      },
      select: {
        id: true,
      },
    });

    const accessToken = createAccessToken(user.id, session.id, user.email);

    setAuthCookies(response, {
      refreshToken: refreshToken,
      isSaved: isSaved,
    });

    return {
      status: 200,
      data: {
        accessToken,
        userData: {
          email: user.email,
          picture: user.profilePicture,
          username: user.username,
          id: user.id,
        },
      },
    };
  },
);
