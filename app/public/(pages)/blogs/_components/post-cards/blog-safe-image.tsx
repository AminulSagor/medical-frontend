"use client";

import { useMemo, useState } from "react";

type BlogSafeImageProps = {
  src?: unknown;
  alt: string;
  className?: string;
};

const FALLBACK_IMAGE = "/images/blog-placeholder.jpg";

function normalizeImageSrc(value: unknown): string {
  if (typeof value === "string") {
    return value.trim();
  }

  if (!value || typeof value !== "object") {
    return "";
  }

  const record = value as Record<string, unknown>;

  for (const key of [
    "imageUrl",
    "url",
    "src",
    "secureUrl",
    "href",
    "location",
  ]) {
    const candidate = record[key];
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }
  }

  return "";
}

function isUsableImageUrl(src: string): boolean {
  if (!src) {
    return false;
  }

  if (src.startsWith("/")) {
    return true;
  }

  if (src.includes("storage.example.com")) {
    return false;
  }

  try {
    const url = new URL(src);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export default function BlogSafeImage({
  src,
  alt,
  className = "",
}: BlogSafeImageProps) {
  const safeSrc = useMemo(() => {
    const normalizedSrc = normalizeImageSrc(src);
    return isUsableImageUrl(normalizedSrc) ? normalizedSrc : FALLBACK_IMAGE;
  }, [src]);

  const [hasError, setHasError] = useState(false);

  return (
    <img
      src={hasError ? FALLBACK_IMAGE : safeSrc}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      onError={() => setHasError(true)}
    />
  );
}
