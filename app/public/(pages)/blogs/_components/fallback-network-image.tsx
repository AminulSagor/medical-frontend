"use client";

import { useMemo, useState } from "react";
import { ImageOff } from "lucide-react";

type FallbackNetworkImageProps = {
  src?: unknown;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  priority?: boolean;
  iconSize?: number;
  fallbackClassName?: string;
};

function cn(...values: Array<string | undefined | null | false>) {
  return values.filter(Boolean).join(" ");
}

function normalizeImageSrc(value: unknown): string {
  if (typeof value === "string") {
    return value.trim();
  }

  if (!value || typeof value !== "object") {
    return "";
  }

  const record = value as Record<string, unknown>;
  for (const key of ["url", "src", "secureUrl", "href", "location"]) {
    const candidate = record[key];
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }
  }

  return "";
}

export default function FallbackNetworkImage({
  src,
  alt,
  className,
  style,
  priority = false,
  iconSize = 28,
  fallbackClassName,
}: FallbackNetworkImageProps) {
  const [hasError, setHasError] = useState(false);

  const normalizedSrc = useMemo(() => normalizeImageSrc(src), [src]);

  if (!normalizedSrc || hasError) {
    return (
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center bg-light-slate/5 text-light-slate/35",
          fallbackClassName,
        )}
        aria-label={alt}
        role="img"
      >
        <ImageOff size={iconSize} strokeWidth={1.75} />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={normalizedSrc}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      onError={() => setHasError(true)}
      className={cn("absolute inset-0 h-full w-full", className)}
      style={style}
    />
  );
}
