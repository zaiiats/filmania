import type { Request, Response } from "express";
import { asyncCatcher } from "../../utils/asyncCatcher.ts";
import { prismaInstance } from "../../lib/prisma.ts";
import { AppError, ParamError } from "../../lib/AppError.ts";
import { UserSignupType } from "../../utils/validation.ts";
import {
  createVerifyEmailLink,
  HTMLTemplates,
  sendMail,
} from "../../utils/mail.ts";
import { hashPassword } from "../../utils/crypto.ts";
import { createVerifyEmailData } from "../../utils/mailTokenValidation.ts";

export const signupController = asyncCatcher(
  async (request: Request, response: Response) => {
    const { username, email, password, dateOfBirth } = response.locals
      .validatedData as UserSignupType;

    const existingUser = await prismaInstance.user.findFirst({
      where: {
        OR: [
          {
            username: username,
          },
          {
            email: email,
          },
        ],
      },
      select: {
        username: true,
        email: true,
        auth: {
          select: {
            email_verified: true,
          },
        },
      },
    });

    if (existingUser) {
      let errorFields: ParamError[] = [];

      if (existingUser.username === username) {
        errorFields.push({ name: "username", code: "already_exists" });
      }
      if (existingUser.email === email) {
        errorFields.push({ name: "email", code: "already_exists" });
      }

      throw new AppError("failed_validation", 409, errorFields);
    }

    const passwordHash = await hashPassword(password);

    const { emailVerifyCode, expiresAt, emailVerifyCodeHash } =
      await createVerifyEmailData();

    await prismaInstance.$transaction(async (tx) => {
      await tx.user.create({
        data: {
          username: username,
          dateOfBirth: dateOfBirth,
          email: email,
          auth: {
            create: {
              password_hash: passwordHash,
            },
          },
          profilePicture:
            "https://cdytzhprdbfgsngrvxdt.supabase.co/storage/v1/object/public/usersProfile/defaultUser.jpg",
          emailVerify: {
            create: {
              token_hash: emailVerifyCodeHash,
              expires_at: expiresAt,
            },
          },
        },
      });
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

    return { status: 204 };
  },
);
