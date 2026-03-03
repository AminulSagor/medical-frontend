// app/(user)/(registered-user)/course/[id]/_components/course-details-hero.tsx

"use client";

import type { CourseDetailsHeroProps } from "@/types/course/course-details-type";

export default function CourseDetailsHero({
  badges,
  title,
}: CourseDetailsHeroProps) {
  // expects badges like: ["3-DAY WORKSHOP", "12.0 CME CREDITS"]
  const leftBadge = badges?.[0] ?? "3-DAY WORKSHOP";
  const rightBadge = badges?.[1] ?? "12.0 CME CREDITS";

  return (
    <section
      className={[
        "relative overflow-hidden rounded-2xl",
        "shadow-[0_10px_22px_rgba(15,23,42,0.10)]",
      ].join(" ")}
    >
      {/* fixed height to match figma */}
      <div className="relative h-[150px] w-full">
        {/* background (no image, pure gradient like screenshot) */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#3e4749] via-[#6f7f7d] to-[#2aa6a7]" />

        {/* subtle top highlight */}
        <div className="absolute -top-10 left-10 h-24 w-24 rounded-full bg-white/10 blur-2xl" />

        {/* content */}
        <div className="absolute inset-0 px-10 py-8">
          <div className="flex items-center gap-3">
            {/* left blue badge */}
            <span className="inline-flex items-center rounded-full bg-sky-500 px-4 py-1 text-[10px] font-extrabold tracking-wide text-white">
              {leftBadge}
            </span>

            {/* right gray badge */}
            <span className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-4 py-1 text-[10px] font-extrabold tracking-wide text-white/90">
              {rightBadge}
            </span>
          </div>

          {/* title */}
          <h1 className="mt-4 max-w-[720px] text-[34px] font-extrabold leading-[1.05] text-white">
            {title}
          </h1>
        </div>
      </div>
    </section>
  );
}