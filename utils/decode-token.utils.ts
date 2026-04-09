export type DecodedTokenPayload = {
  sub?: string;
  role?: string;
  medicalEmail?: string;
  iat?: number;
  exp?: number;
};

export const decodeToken = (
  token: string,
): DecodedTokenPayload | null => {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(base64);
    const parsed = JSON.parse(decoded) as DecodedTokenPayload;

    return parsed;
  } catch {
    return null;
  }
};

export const getRoleFromToken = (token: string): string | null => {
  const decoded = decodeToken(token);
  return decoded?.role ?? null;
};