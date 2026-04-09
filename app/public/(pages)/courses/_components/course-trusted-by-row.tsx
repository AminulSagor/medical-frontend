"use client";

import { CourseDetails } from "@/app/public/types/course.details.types";

export default function CourseTrustedByRow({ data }: { data: CourseDetails }) {
  return (
    <div className="mt-10 border-t border-light-slate/15 pt-8">
      <div className="mx-auto max-w-7xl px-0">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <p className="text-xs font-extrabold tracking-[0.18em] text-light-slate">
            {data.trustedBy.label}
          </p>

          <div className="flex flex-wrap items-center gap-10">
            {data.trustedBy.brands.map((b) => (
              <span
                key={b}
                className="text-sm font-extrabold tracking-widest text-light-slate/70"
              >
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
