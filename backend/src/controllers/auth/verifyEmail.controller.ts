import { Request, Response } from "express";
import { asyncCatcher } from "../../utils/asyncCatcher";
import { UserVerifyEmailType } from "../../utils/validation";
import { prismaInstance } from "../../lib/prisma";
import { validateHashOTP } from "../../utils/crypto";
import { AppError } from "../../lib/AppError";
import dayjs from "dayjs";

const BLOCK_ATTEMPTS = [0, 1, 3, 5, 15];

export const verifyMailController = asyncCatcher(
  async (request: Request, response: Response) => {
    const { email, token } = response.locals
      .validatedData as UserVerifyEmailType;

    const emailVerifyData = await prismaInstance.emailVerify.findFirst({
      where: {
        user: {
          email: email,
        },
      },
      select: {
        id: true,
        token_hash: true,
        user_id: true,
        blocked_until: true,
        attempts: true,
        expires_at: true,
        user: {
          select: {
            auth: {
              select: {
                email_verified: true,
              },
            },
          },
        },
      },
    });

    if (!emailVerifyData) {
      throw new AppError("no_user", 404);
    }

    if (emailVerifyData.user.auth?.email_verified) {
      throw new AppError("already_verified", 409);
    }

    if (emailVerifyData.expires_at < new Date()) {
      throw new AppError("token_expired", 410);
    }

    if (
      emailVerifyData.blocked_until &&
      emailVerifyData.blocked_until > new Date()
    ) {
      throw new AppError("too_many_tries", 429, [
        {
          name: "verifyEmail",
          code: "too_many_retries",
          params: {
            retryIn: dayjs(emailVerifyData.blocked_until)
              .diff(dayjs(), "second")
              .toString(),
          },
        },
      ]);
    }

    const isOk = await validateHashOTP(token, emailVerifyData?.token_hash);

    if (!isOk) {
      const currentAttempts = emailVerifyData.attempts || 0;
      const blockTime = BLOCK_ATTEMPTS[currentAttempts];

      if (blockTime === undefined) {
        await prismaInstance.emailVerify.delete({
          where: {
            user_id: emailVerifyData.user_id,
          },
        });
        throw new AppError("too_much_attempts", 429);
      }

      const blockedUntil = blockTime
        ? dayjs().add(blockTime, "minute").toDate()
        : null;

      await prismaInstance.emailVerify.update({
        where: {
          id: emailVerifyData.id,
        },
        data: {
          attempts: currentAttempts + 1,
          blocked_until: blockedUntil,
        },
      });

      throw new AppError("invalid_token", 422);
    } else {
      await prismaInstance.$transaction(async (tx) => {
        await tx.emailVerify.delete({
          where: {
            user_id: emailVerifyData.user_id,
          },
        });

        await tx.auth.update({
          where: {
            user_id: emailVerifyData.user_id,
          },
          data: {
            email_verified: true,
          },
        });
      });
    }

    return { status: 204 };
  },
);
