import { Request, Response } from "express";
import { asyncCatcher } from "../../utils/asyncCatcher";
import { AppError } from "../../lib/AppError";
import { generateUUID } from "../../utils/crypto";

export const oauthProviderController = asyncCatcher(
  async (req: Request, res: Response) => {
    const provider = req.params.provider;

    if (!provider) {
      throw new AppError("not_found", 404);
    }

    if (provider === "google") {
      const state = generateUUID();

      res.cookie(`${provider}_oauth_state`, state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 600000,
        sameSite: "lax",
        path: "/",
      });

      const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");

      url.searchParams.set("client_id", process.env.GOOGLE_CLIENT_ID!);
      url.searchParams.set("response_type", "code");
      url.searchParams.set("scope", "openid email profile");
      url.searchParams.set("state", state);
      url.searchParams.set(
        "redirect_uri",
        `${process.env.APP_URL}/auth/oauth/google/callback`,
      );

      return res.redirect(url.toString());
    }

    throw new AppError("provider_not_supported", 404);
  },
);
