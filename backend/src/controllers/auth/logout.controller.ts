import { Request, Response } from "express";
import { asyncCatcher } from "../../utils/asyncCatcher";
import { clearAuthCookies } from "../../utils/cookie";
import { prismaInstance } from "../../lib/prisma";
import { redisInstance } from "../../lib/redis";

export const logoutController = asyncCatcher(
  async (request: Request, response: Response) => {
    const user = request.user;

    if (!user?.sessionId) return { status: 204 };

    const { count } = await prismaInstance.session.updateMany({
      where: {
        id: user?.sessionId,
        revoked_at: null,
      },
      data: {
        revoked_at: new Date(),
      },
    });

    if (count > 0) {
      await redisInstance.set(
        `revoked:session:${user?.sessionId}`,
        1,
        "EX",
        900,
      ); // access time exp
    }

    clearAuthCookies(response);

    return { status: 204 };
  },
);
