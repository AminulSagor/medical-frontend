import axios from "axios";
import { service_URL } from "@/config/env";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const serviceServer = axios.create({
  baseURL: service_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

serviceServer.interceptors.request.use(async (config) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "en";

  if (!token) {
    redirect(`/${locale}/login`);
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

serviceServer.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const cookieStore = await cookies();
      const locale = cookieStore.get("NEXT_LOCALE")?.value || "en";
      redirect(`/${locale}/login`);
    }
    return Promise.reject(error);
  }
);