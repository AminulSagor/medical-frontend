export const AUTH_CHANGED_EVENT = "auth-changed";

const notifyAuthChanged = () => {
  if (typeof window === "undefined") return;

  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
};

export const setToken = (token: string) => {
  if (typeof document === "undefined") return;

  document.cookie = `access_token=${token}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax;`;
  notifyAuthChanged();
};

export const setUserRole = (role: string) => {
  if (typeof document === "undefined") return;

  document.cookie = `user_role=${role}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax;`;
  notifyAuthChanged();
};

export const getToken = (): string | null => {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(/(?:^|;\s*)access_token=([^;]+)/);
  return match ? match[1] : null;
};

export const getUserRole = (): string | null => {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(/(?:^|;\s*)user_role=([^;]+)/);
  return match ? match[1] : null;
};

export const removeToken = () => {
  if (typeof document === "undefined") return;

  document.cookie = "access_token=; path=/; max-age=0; SameSite=Lax;";
  notifyAuthChanged();
};

export const removeUserRole = () => {
  if (typeof document === "undefined") return;

  document.cookie = "user_role=; path=/; max-age=0; SameSite=Lax;";
  notifyAuthChanged();
};

export const clearAuthCookies = () => {
  if (typeof document === "undefined") return;

  document.cookie = "access_token=; path=/; max-age=0; SameSite=Lax;";
  document.cookie = "user_role=; path=/; max-age=0; SameSite=Lax;";
  notifyAuthChanged();
};