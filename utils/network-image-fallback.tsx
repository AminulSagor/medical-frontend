"use client";

import * as React from "react";
import { ImageOff, UserRound } from "lucide-react";

export type NetworkImageFallbackProps = Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  "src"
> & {
  src?: string | null;
  fallbackClassName?: string;
  iconClassName?: string;
  fallbackVariant?: "generic" | "cover" | "avatar";
  showFallbackIcon?: boolean;
};

function CoverFallback({
  alt,
  className,
  iconClassName,
  showIcon = true,
}: {
  alt?: string;
  className?: string;
  iconClassName?: string;
  showIcon?: boolean;
}) {
  return (
    <div
      aria-label={alt || "Image unavailable"}
      className={[
        "relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white/70",
        className || "flex h-full w-full items-center justify-center",
      ].join(" ")}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.95),transparent_55%)]" />
      <div className="absolute -left-8 top-6 h-24 w-24 rounded-full bg-sky-400/10 blur-3xl" />
      <div className="absolute -right-10 bottom-2 h-28 w-28 rounded-full bg-cyan-300/10 blur-3xl" />
      {showIcon ? (
        <div className="relative z-10 flex h-full w-full items-center justify-center">
          <ImageOff className={iconClassName ?? "h-10 w-10"} aria-hidden="true" />
        </div>
      ) : null}
    </div>
  );
}

function AvatarFallback({
  alt,
  className,
  iconClassName,
  showIcon = true,
}: {
  alt?: string;
  className?: string;
  iconClassName?: string;
  showIcon?: boolean;
}) {
  return (
    <div
      aria-label={alt || "Profile image unavailable"}
      className={[
        "relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white/85",
        className || "flex h-full w-full items-center justify-center",
      ].join(" ")}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.95),transparent_58%)]" />
      <div className="absolute -left-3 -top-3 h-10 w-10 rounded-full bg-sky-300/12 blur-2xl" />
      {showIcon ? (
        <div className="relative z-10 flex h-full w-full items-center justify-center">
          <UserRound className={iconClassName ?? "h-5 w-5"} aria-hidden="true" />
        </div>
      ) : null}
    </div>
  );
}

export default function NetworkImageFallback({
  src,
  alt,
  className,
  fallbackClassName,
  iconClassName,
  fallbackVariant = "generic",
  showFallbackIcon = true,
  onError,
  ...imgProps
}: NetworkImageFallbackProps) {
  const normalizedSrc = typeof src === "string" ? src.trim() : "";
  const isMissing = normalizedSrc.length === 0;
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    setHasError(false);
  }, [normalizedSrc]);

  if (isMissing || hasError) {
    const shouldShowIcon = hasError ? true : showFallbackIcon;

    if (fallbackVariant === "cover") {
      return (
        <CoverFallback
          alt={alt}
          className={fallbackClassName}
          iconClassName={iconClassName}
          showIcon={shouldShowIcon}
        />
      );
    }

    if (fallbackVariant === "avatar") {
      return (
        <AvatarFallback
          alt={alt}
          className={fallbackClassName}
          iconClassName={iconClassName}
          showIcon={shouldShowIcon}
        />
      );
    }

    return (
      <div
        aria-label={alt || "Image unavailable"}
        className={fallbackClassName ?? "flex items-center justify-center bg-slate-100 text-slate-400"}
      >
        {shouldShowIcon ? (
          <ImageOff className={iconClassName ?? "h-5 w-5"} aria-hidden="true" />
        ) : null}
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
