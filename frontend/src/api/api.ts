import { login } from "./auth/login";
import { logout } from "./auth/logout";
import { refresh } from "./auth/refresh";
import { signup } from "./auth/signup";
import { verifyEmail } from "./auth/verifyEmail";

export const api = {
  login,
  refresh,
  logout,
  signup,
  verifyEmail,
};
