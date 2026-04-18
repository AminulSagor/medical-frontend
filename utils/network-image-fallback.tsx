"use client";

import * as React from "react";
import { ImageOff } from "lucide-react";

export type NetworkImageFallbackProps = Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  "src"
> & {
  src?: string | null;
  fallbackClassName?: string;
  iconClassName?: string;
};

export default function NetworkImageFallback({
  src,
  alt,
  className,
  fallbackClassName,
  iconClassName,
  onError,
  ...imgProps
}: NetworkImageFallbackProps) {
  const normalizedSrc = typeof src === "string" ? src.trim() : "";
  const [hasError, setHasError] = React.useState(normalizedSrc.length === 0);

  React.useEffect(() => {
    setHasError(normalizedSrc.length === 0);
  }, [normalizedSrc]);

  if (hasError) {
    return (
      <div
        aria-label={alt || "Image unavailable"}
        className={fallbackClassName ?? "flex items-center justify-center bg-slate-100 text-slate-400"}
      >
        <ImageOff className={iconClassName ?? "h-5 w-5"} aria-hidden="true" />
      </div>
    );
  }

  return (
    <img
      {...imgProps}
      src={normalizedSrc}
      alt={alt || ""}
      className={className}
      onError={(event) => {
        setHasError(true);
        onError?.(event);
      }}
    />
  );
}
