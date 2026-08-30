import { login } from "./auth/login";
import { logout } from "./auth/logout";
import { refresh } from "./auth/refresh";

export const api = {
  login,
  refresh,
  logout,
};
