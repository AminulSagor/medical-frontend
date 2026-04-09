import axios from "axios";
import { service_URL } from "@/config/env";
import { getToken, removeToken } from "@/utils/token/cookie_utils";

export const serviceClient = axios.create({
  baseURL: service_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

//Request interceptor
serviceClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
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
        if (!window.location.pathname.includes("/public/auth/sign-in")) {
          window.location.href = `/public/auth/sign-in`;
        }
      }
    }
    return Promise.reject(error);
  },
);
