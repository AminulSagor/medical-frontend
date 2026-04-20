"use client";

import NetworkImageFallback from "@/utils/network-image-fallback";
import type { CourseDetailsHeroProps } from "@/types/user/course/course-details-type";

export default function CourseDetailsHero({
  badges,
  title,
  imageSrc,
}: CourseDetailsHeroProps) {
  const leftBadge = badges?.[0] ?? "COURSE";
  const rightBadge = badges?.[1] ?? "";

  return (
    <section className="relative overflow-hidden rounded-2xl shadow-[0_10px_22px_rgba(15,23,42,0.10)]">
      <div className="relative h-[150px] w-full bg-slate-900 md:h-[180px]">
        <NetworkImageFallback
          src={imageSrc}
          alt={title}
          className="h-full w-full object-cover"
          fallbackVariant="cover"
          fallbackClassName="h-full w-full"
          iconClassName="h-10 w-10"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/55 to-slate-900/15" />
        <div className="absolute -top-10 left-10 h-24 w-24 rounded-full bg-white/10 blur-2xl" />

        <div className="absolute inset-0 px-6 py-6 md:px-10 md:py-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center rounded-full bg-sky-500 px-4 py-1 text-[10px] font-extrabold tracking-wide text-white">
              {leftBadge}
            </span>
            <span className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-4 py-1 text-[10px] font-extrabold tracking-wide text-white/90">
              {rightBadge}
            </span>
          </div>

          <h1 className="mt-4 max-w-[720px] text-[28px] font-extrabold leading-[1.05] text-white md:text-[34px]">
            {title}
          </h1>
        </div>
      </div>
    </section>
  );
}
