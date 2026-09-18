import { Request, Response } from "express";
import { asyncCatcher } from "../../utils/asyncCatcher";
import { createAccessToken, createRefresh } from "../../utils/tokens";
import { prismaInstance } from "../../lib/prisma";
import { AppError } from "../../lib/AppError";
import { hashToken } from "../../utils/crypto";
import {
  clearAuthCookies,
  setAuthCookies,
  validateCookies,
} from "../../utils/cookie";

export const refreshController = asyncCatcher(
  async (req: Request, res: Response) => {
    const { refresh } = validateCookies(req);

    const refreshHash = hashToken(refresh);

    const refreshData = await prismaInstance.session.findUnique({
      where: {
        token_hash: refreshHash,
      },
      select: {
        expires_at: true,
        user_id: true,
        id: true,
        revoked_at: true,
        is_persistent: true,
        user: {
          select: {
            email: true,
            profilePicture: true,
            username: true,
            id: true,
            auth: {
              select: {
                email_verified: true,
              },
            },
          },
        },
      },
    });

    if (
      !refreshData ||
      refreshData.revoked_at ||
      refreshData.expires_at <= new Date()
    ) {
      clearAuthCookies(res);
      throw new AppError("unauthorized", 401);
    }

    if (refreshData.user.auth && !refreshData.user.auth.email_verified) {
      clearAuthCookies(res);
      throw new AppError("unauthorized", 401);
    }

    const {
      expiresAt,
      refreshHash: newRefreshHash,
      refreshToken: newRefreshToken,
    } = createRefresh();

    await prismaInstance.session.update({
      where: {
        id: refreshData.id,
      },
      data: {
        expires_at: expiresAt,
        token_hash: newRefreshHash,
      },
    });

    const accessToken = createAccessToken(
      refreshData.user_id,
      refreshData.id,
      refreshData.user.email,
    );

    setAuthCookies(res, {
      refreshToken: newRefreshToken,
      isSaved: refreshData.is_persistent,
    });

    return {
      status: 200,
      data: {
        accessToken,
        userData: {
          id: refreshData.user.id,
          email: refreshData.user.email,
          username: refreshData.user.username,
          profilePicture: refreshData.user.profilePicture,
        },
      },
    };
  },
);
