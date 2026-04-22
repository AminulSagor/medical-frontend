import axios from "axios";
import { service_URL } from "@/config/env";
import { getToken, removeToken } from "@/utils/token/cookie_utils";

export const serviceClient = axios.create({
  baseURL: service_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

function buildSignInRedirectUrl() {
  if (typeof window === "undefined") {
    return "/public/auth/sign-in";
  }

  const currentPath = window.location.pathname;
  const currentSearch = window.location.search;
  const currentUrl = `${currentPath}${currentSearch}`;

  if (currentPath.includes("/public/auth/sign-in")) {
    return "/public/auth/sign-in";
  }

  return `/public/auth/sign-in?redirect=${encodeURIComponent(currentUrl)}`;
}

// Request interceptor
serviceClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    const url = config.url ?? "";

    if (token && url !== "/contact-us") {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor
serviceClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken();

      if (typeof window !== "undefined") {
        const redirectUrl = buildSignInRedirectUrl();

        if (!window.location.pathname.includes("/public/auth/sign-in")) {
          window.location.href = redirectUrl;
        }
      }
    }

    return Promise.reject(error);
  },
);