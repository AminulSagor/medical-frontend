import { clearAuthCookies } from "@/utils/token/cookie_utils";

export const logoutUser = () => {
  clearAuthCookies();
  window.location.href = "/public/auth/sign-in";
};
