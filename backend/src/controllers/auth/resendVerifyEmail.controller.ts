import { Request, Response } from "express";
import { asyncCatcher } from "../../utils/asyncCatcher";
import { prismaInstance } from "../../lib/prisma";
import { createVerifyEmailData } from "../../utils/mailTokenValidation";
import {
  createVerifyEmailLink,
  HTMLTemplates,
  sendMail,
} from "../../utils/mail";
import dayjs from "dayjs";

export const resendVerifyEmail = asyncCatcher(
  async (req: Request, res: Response) => {
    const { email } = res.locals.validatedData;

    const user = await prismaInstance.user.findUnique({
      where: {
        email: email,
      },
      select: {
        auth: {
          select: {
            email_verified: true,
            user_id: true,
            createdAt: true,
          },
        },
      },
    });

    const auth = user?.auth;

    if (!auth || !auth.user_id || auth?.email_verified) {
      return { status: 204 };
    }

    const emailVerify = await prismaInstance.emailVerify.findUnique({
      where: {
        user_id: auth.user_id,
      },
      select: {
        createdAt: true,
      },
    });

    if (
      emailVerify?.createdAt &&
      new Date() < dayjs(emailVerify?.createdAt).add(60, "second").toDate()
    ) {
      return { status: 204 };
    }

    const { emailVerifyCode, expiresAt, emailVerifyCodeHash } =
      await createVerifyEmailData();

    await prismaInstance.emailVerify.upsert({
      where: {
        user_id: auth.user_id,
      },
      update: {
        user_id: auth.user_id,
        expires_at: expiresAt,
        attempts: 0,
        blocked_until: null,
        token_hash: emailVerifyCodeHash,
        createdAt: new Date(),
      },
      create: {
        user_id: auth.user_id,
        token_hash: emailVerifyCodeHash,
        expires_at: expiresAt,
        attempts: 0,
        blocked_until: null,
        createdAt: new Date(),
      },
    });

    await sendMail({
      email: email,
      subject: "Hello world!",
      html: HTMLTemplates.verifyMail({
        email: email,
        code: emailVerifyCode,
        fullVerifyEmail: createVerifyEmailLink({
          code: emailVerifyCode,
          email: email,
        }),
      }),
    });

    console.log("sent-verification");

    return { status: 204 };
  },
);
