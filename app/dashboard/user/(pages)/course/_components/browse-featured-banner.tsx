"use client";

import Image from "next/image";
import type { BrowseFeaturedCourse } from "@/types/user/course/course-type";

export default function BrowseFeaturedBanner({
  badge,
  title,
  description,
  imageSrc,
  primaryActionLabel,
  secondaryActionLabel,
  onPrimaryAction,
  onSecondaryAction,
}: BrowseFeaturedCourse) {
  return (
    <div
      className={[
        "overflow-hidden rounded-2xl border border-slate-200 bg-white",
        "shadow-[0_8px_20px_rgba(15,23,42,0.06)]",
      ].join(" ")}
    >
      <div className="relative h-[210px] w-full md:h-[230px]">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover"
          priority
        />

        {/* overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/50 to-slate-950/10" />

        {/* content */}
        <div className="absolute inset-0 flex items-start">
          <div className="w-full px-6 pt-6 pb-6 md:px-8 md:pt-8 md:pb-8">
            <span className="inline-flex items-center rounded-full bg-sky-600/90 px-3 py-1 text-[10px] font-bold tracking-wide text-white">
              {badge}
            </span>

            <h2 className="mt-3 max-w-[520px] text-[22px] font-extrabold leading-tight text-white md:text-[26px]">
              {title}
            </h2>

            <p className="mt-2 max-w-[560px] text-[11px] leading-relaxed text-white/80 md:text-[12px]">
              {description}
            </p>

            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={onPrimaryAction}
                className="h-9 rounded-lg bg-sky-600 px-4 text-[11px] font-semibold text-white hover:bg-sky-700 active:scale-[0.99]"
              >
                {primaryActionLabel}
              </button>

              <button
                type="button"
                onClick={onSecondaryAction}
                className="h-9 rounded-lg bg-white/15 px-4 text-[11px] font-semibold text-white ring-1 ring-inset ring-white/20 hover:bg-white/20 active:scale-[0.99]"
              >
                {secondaryActionLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
