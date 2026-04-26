"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Play } from "lucide-react";
import { ProductDetails } from "@/app/public/types/product.details";

function Badge({
  label,
  tone,
  icon,
}: {
  label: string;
  tone: "primary" | "dark";
  icon?: "workshop";
}) {
  const base =
    "inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold tracking-wide";

  if (tone === "primary") {
    return <div className={`${base} bg-primary text-white`}>{label}</div>;
  }

  return (
    <div className={`${base} bg-black/80 text-white`}>
      {icon ? (
        <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-white/15" />
      ) : null}
      {label}
    </div>
  );
}

export default function ProductGalleryClient({
  product,
}: {
  product: ProductDetails;
}) {
  const initial = useMemo(
    () => product.media.thumbnails?.[0]?.imageUrl ?? product.media.heroImageUrl,
    [product.media.heroImageUrl, product.media.thumbnails],
  );

  const [active, setActive] = useState(initial);

  return (
    <div className="w-full">
      <div className="relative overflow-hidden rounded-3xl bg-light-slate/5 p-4 sm:p-6">
        <div className="absolute left-6 top-6 z-10 flex flex-col gap-2">
          {product.badges.map((badge) => (
            <Badge
              key={badge.id}
              label={badge.label}
              tone={badge.tone}
              icon={badge.icon}
            />
          ))}
        </div>

        <div className="relative mx-auto flex max-w-[560px] items-center justify-center rounded-3xl p-3 sm:p-6">
          <div className="relative w-full overflow-hidden rounded-3xl bg-white">
            <div className="relative aspect-square max-h-[420px] w-full sm:max-h-[520px]">
              <Image
                src={active}
                alt={product.title}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>

            {product.media.heroHasPlayButton ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200">
                  <Play className="h-7 w-7 text-primary" />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-4 gap-3 sm:gap-4">
        {product.media.thumbnails.map((thumbnail, index) => {
          const isActive = thumbnail.imageUrl === active;

          return (
            <button
              key={thumbnail.id}
              type="button"
              onClick={() => setActive(thumbnail.imageUrl)}
              className={`overflow-hidden rounded-2xl bg-white ring-1 transition-all ${isActive ? "ring-primary" : "ring-slate-200 hover:ring-slate-300"
                }`}
            >
              <div className="relative aspect-square w-full">
                <Image
                  src={thumbnail.imageUrl}
                  alt={`${product.title} - Thumbnail ${index + 1}`}
                  fill
                  className="object-contain"
                  sizes="25vw"
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}