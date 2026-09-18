import { Request, Response } from "express";
import { asyncCatcher } from "../../utils/asyncCatcher";
import { AppError } from "../../lib/AppError";
import { prismaInstance } from "../../lib/prisma";
import { generateOTP } from "../../utils/crypto";
import { createRefresh } from "../../utils/tokens";
import { setAuthCookies } from "../../utils/cookie";
import { FRONTEND_URL } from "../../constants";

interface OuthResponse {
  accountId?: string;
  picture?: string;
  email?: string;
}

export const oauthCallbackController = asyncCatcher(
  async (req: Request, res: Response) => {
    const oauthResponse: OuthResponse = {};

    const { provider } = req.params;

    if (provider === "google") {
      const { code, state } = req.query;

      if (!code || !state) {
        throw new AppError("no_token", 400);
      }

      const cookieState = req.cookies.google_oauth_state;

      console.log(req.cookies);

      if (cookieState !== state) {
        throw new AppError("csrf_fail", 400);
      }

      const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code: String(code),
          client_id: process.env.GOOGLE_CLIENT_ID!,
          client_secret: process.env.GOOGLE_CLIENT_SECRET!,
          redirect_uri: `${process.env.APP_URL}/auth/oauth/google/callback`,
          grant_type: "authorization_code",
        }),
      });

      const tokens = await tokenRes.json();

      const userRes = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: { Authorization: `Bearer ${tokens.access_token}` },
        },
      );

      const { sub, email, picture } = await userRes.json();

      oauthResponse.accountId = sub;
      oauthResponse.email = email;
      oauthResponse.picture = picture;
    } else {
      throw new AppError("provider_not_found", 404);
    }

    res.clearCookie(`${provider}_oauth_state`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 600000,
      sameSite: "lax",
      path: "/",
    });

    console.log(oauthResponse);

    if (
      !oauthResponse.accountId ||
      !oauthResponse.email ||
      !oauthResponse.picture
    ) {
      throw new AppError("invalid_oauth_response_structure", 500);
    }

    const { accountId, email, picture } = oauthResponse;

    const existingUser = await prismaInstance.user.findFirst({
      where: {
        email: email,
      },

      select: {
        id: true,
        username: true,
        email: true,
        auth: {
          select: {
            email_verified: true,
          },
        },
        oAuthAccount: {
          where: {
            provider: provider,
          },
          select: {
            id: true,
          },
        },
      },
    });

    let userId: string;

    if (existingUser) {
      if (existingUser.oAuthAccount.length === 0) {
        await prismaInstance.$transaction(async (tx) => {
          await tx.emailVerify.deleteMany({
            where: {
              user_id: existingUser.id,
            },
          });

          if (existingUser.auth !== null) {
            await tx.auth.update({
              where: {
                user_id: existingUser.id,
              },
              data: {
                email_verified: true,
              },
            });
          }

          await tx.oAuthAccount.create({
            data: {
              providerAccountId: accountId,
              provider: provider,
              user_id: existingUser.id,
            },
          });
        });
      }
      userId = existingUser.id;
    } else {
      let username = `${email.split("@")[0]}_${generateOTP(8)}`;

      const { id } = await prismaInstance.user.create({
        data: {
          email: email,
          profilePicture: picture,
          username: username,
          oAuthAccount: {
            create: {
              providerAccountId: accountId,
              provider: provider,
            },
          },
        },
        select: {
          id: true,
        },
      });

      userId = id;
    }

    const { refreshHash, refreshToken, expiresAt } = createRefresh();

    console.log(refreshToken);

    await prismaInstance.session.create({
      data: {
        user_id: userId,
        token_hash: refreshHash,
        is_persistent: true,
        ip_address: req.ip || null,
        expires_at: expiresAt,
      },
    });

    setAuthCookies(res, {
      refreshToken: refreshToken,
      isSaved: true,
    });

    return res.redirect(`${FRONTEND_URL}`);
  },
);
