import axios from "axios";
import { service_URL } from "@/config/env";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Create Axios instance for server-side
export const serviceServer = axios.create({
  baseURL: service_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding token from cookies
serviceServer.interceptors.request.use(async (config) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "en";

  if (!token) {
    // If no token, redirect to login page
    redirect(`/${locale}/login`);
  }

  // Attach token to request header if present
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for handling 401 responses
serviceServer.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const cookieStore = await cookies();
      const locale = cookieStore.get("NEXT_LOCALE")?.value || "en";
      // Redirect to login page if unauthorized
      redirect(`/${locale}/login`);
    }
    return Promise.reject(error);
  }
);