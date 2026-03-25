// src/config/env.ts
export const service_URL =
  process.env.NEXT_PUBLIC_BASE_URL ||
  process.env.BASE_URL ||
  "http://localhost:5000";

if (!process.env.NEXT_PUBLIC_BASE_URL && !process.env.BASE_URL) {
  // keep it non-crashing in prod builds; but warn in dev
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.warn(
      "NEXT_PUBLIC_BASE_URL is not set, using fallback: http://localhost:5000"
    );
  }
}
