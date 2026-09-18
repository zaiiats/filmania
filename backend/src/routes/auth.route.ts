import { Router } from "express";
import { loginController } from "../controllers/auth/login.controller.ts";
import paramsValidator from "../middlewares/paramsValidator.ts";
import { signupController } from "../controllers/auth/signup.controller.ts";
import {
  userLoginSchema,
  userSignupSchema,
  userVerifyEmailSchema,
} from "../utils/validation.ts";
import { logoutController } from "../controllers/auth/logout.controller.ts";
import { authMiddleware } from "../middlewares/auth.ts";
import { verifyMailController } from "../controllers/auth/verifyEmail.controller.ts";
import { resendVerifyEmail } from "../controllers/auth/resendVerifyEmail.controller.ts";
import { oauthProviderController } from "../controllers/auth/oauthProvider.controller.ts";
import { oauthCallbackController } from "../controllers/auth/oauthCallback.controller.ts";
import { refreshController } from "../controllers/auth/refresh.controller.ts";
import multer from "multer";
import { updateLogoController } from "../controllers/auth/updateLogo.controller.ts";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post(
  "/login",
  paramsValidator({
    zodSchema: userLoginSchema,
    source: "body",
  }),
  loginController,
);

router.post(
  "/signup",
  paramsValidator({
    zodSchema: userSignupSchema,
    source: "body",
  }),
  signupController,
);

router.post(
  "/verify-email",
  paramsValidator({
    zodSchema: userVerifyEmailSchema,
    source: "body",
  }),
  verifyMailController,
);

router.get(
  "/resend-verify-email",
  paramsValidator([
    {
      name: "email",
      type: "string",
      source: "url",
    },
  ]),
  resendVerifyEmail,
);

router.post("/logout", authMiddleware(), logoutController);

router.get("/oauth/:provider", oauthProviderController);
router.get("/oauth/:provider/callback", oauthCallbackController);

router.get("/refresh", refreshController);

router.put(
  "/avatar",
  authMiddleware(),
  upload.single("avatar"),
  updateLogoController,
);

export default router;
