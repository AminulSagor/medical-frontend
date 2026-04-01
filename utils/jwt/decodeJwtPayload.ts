import type { JwtPayload } from "@/utils/token/jwtTypes";

function base64UrlToJson(part: string): unknown | null {
  try {
    const pad = "=".repeat((4 - (part.length % 4)) % 4);
    const b64 = (part + pad).replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(b64);
    return JSON.parse(json) as unknown;
  } catch {
    return null;
  }
}

export function decodeJwtPayload(accessToken: string | null | undefined): JwtPayload | null {
  if (!accessToken?.includes(".")) return null;
  const parts = accessToken.split(".");
  if (parts.length < 2) return null;
  const payload = base64UrlToJson(parts[1]);
  if (!payload || typeof payload !== "object") return null;
  return payload as JwtPayload;
}
