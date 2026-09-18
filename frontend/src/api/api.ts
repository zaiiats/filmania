import { login } from "./auth/login";
import { logout } from "./auth/logout";
import { refresh } from "./auth/refresh";
import { resendVerifyEmail } from "./auth/resendVerifyEmail";
import { signup } from "./auth/signup";
import { verifyEmail } from "./auth/verifyEmail";
import { oauthLogin } from "./auth/oauthLogin";
import { updateAvatar } from "./auth/updateAvatar";
import { findMovie } from "./imdb/findMovie";
import { getMovie } from "./imdb/getMovie";
import { createReview } from "./review/createReview";

export const api = {
  auth: {
    login,
    refresh,
    logout,
    signup,
    verifyEmail,
    resendVerifyEmail,
    oauthLogin,
    updateAvatar,
  },
  imdb: {
    findMovie,
    getMovie,
  },
  review: {
    createReview,
  },
};
