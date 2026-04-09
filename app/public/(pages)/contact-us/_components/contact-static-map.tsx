"use client";

import React from "react";
import { ExternalLink, ImageOff, MapPin } from "lucide-react";

type Props = {
  imageUrl?: string;
  title?: string;
  subtitle?: string;
  openHref?: string;
};

export default function ContactStaticMap({
  imageUrl,
  title = "Texas, USA",
  subtitle = "31.9686, -99.9018",
  openHref,
}: Props) {
  const [hasError, setHasError] = React.useState(false);

  if (!imageUrl || hasError) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-slate-100 px-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm">
          <ImageOff className="h-5 w-5" />
        </div>
        <p className="mt-4 text-sm font-medium text-slate-700">Map preview unavailable</p>
        <p className="mt-1 text-xs text-slate-500">
          Texas coordinates: {subtitle}
        </p>
        {openHref ? (
          <a
            href={openHref}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-light-slate/20 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Open location
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        ) : null}
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-slate-100">
      <img
        src={imageUrl}
        alt={`${title} static map`}
        className="h-full w-full object-cover"
        loading="lazy"
        onError={() => setHasError(true)}
      />

      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/55 via-black/10 to-transparent" />

      <div className="absolute bottom-4 left-4 rounded-2xl bg-white/95 px-4 py-3 shadow-lg backdrop-blur-sm">
        <div className="flex items-center gap-2 text-slate-900">
          <MapPin className="h-4 w-4 text-primary" />
          <p className="text-sm font-semibold">{title}</p>
        </div>
        <p className="mt-1 text-xs text-slate-600">Coordinates: {subtitle}</p>
      </div>

      {openHref ? (
        <a
          href={openHref}
          target="_blank"
          rel="noreferrer"
          className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-slate-800 shadow-sm transition hover:bg-white"
        >
          Open map
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      ) : null}
    </div>
  );
}
