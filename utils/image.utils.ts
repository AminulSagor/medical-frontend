export const FALLBACK_IMAGE_SRC = "/images/fallback-image.png";

const NEXT_IMAGE_ALLOWED_HOSTNAMES = [
  "ibass-collection.s3.ap-south-1.amazonaws.com",
];

export function isLocalImage(src?: string | null): boolean {
  return typeof src === "string" && src.startsWith("/");
}

export function isAllowedRemoteImage(src?: string | null): boolean {
  if (!src || typeof src !== "string") return false;

  try {
    const url = new URL(src);
    return NEXT_IMAGE_ALLOWED_HOSTNAMES.includes(url.hostname);
  } catch {
    return false;
  }
}

export function getSafeImageSrc(src?: string | null): string {
  if (!src || !src.trim()) {
    return FALLBACK_IMAGE_SRC;
  }

  if (isLocalImage(src)) {
    return src;
  }

  if (isAllowedRemoteImage(src)) {
    return src;
  }

  return FALLBACK_IMAGE_SRC;
}
