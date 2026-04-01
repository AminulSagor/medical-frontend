import type { AxiosError } from "axios";

export function axiosErrorMessage(err: unknown, fallback: string): string {
  const ax = err as AxiosError<{ message?: unknown }>;
  const raw = ax.response?.data?.message;
  if (Array.isArray(raw)) {
    return raw.map(String).join(", ");
  }
  if (typeof raw === "string" && raw.trim()) {
    return raw;
  }
  return fallback;
}
