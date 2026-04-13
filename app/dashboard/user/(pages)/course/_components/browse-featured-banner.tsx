"use client";

import { useRouter } from "next/navigation";
import type { BrowseCourseItem } from "@/types/user/course/course-type";

function openRoute(route: string, router: ReturnType<typeof useRouter>) {
  if (!route) return;

  if (/^https?:\/\//i.test(route)) {
    window.open(route, "_blank", "noopener,noreferrer");
    return;
  }

  router.push(route);
}

export default function BrowseFeaturedBanner({
  course,
}: {
  course: BrowseCourseItem;
}) {
  const router = useRouter();

  return (
    <div
      className={[
        "overflow-hidden rounded-2xl border border-slate-200 bg-white",
        "shadow-[0_8px_20px_rgba(15,23,42,0.06)]",
      ].join(" ")}
    >
      <div className="relative h-[210px] w-full overflow-hidden bg-gradient-to-r from-slate-950 via-slate-800 to-sky-700 md:h-[230px]">
        {course.coverImageUrl ? (
          <img
            src={course.coverImageUrl}
            alt={course.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null}

        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/50 to-slate-950/10" />

        <div className="absolute inset-0 flex items-start">
          <div className="w-full px-6 pb-6 pt-6 md:px-8 md:pb-8 md:pt-8">
            <span className="inline-flex items-center rounded-full bg-sky-600/90 px-3 py-1 text-[10px] font-bold tracking-wide text-white">
              {course.tag}
            </span>

            <h2 className="mt-3 max-w-[520px] text-[22px] font-extrabold leading-tight text-white md:text-[26px]">
              {course.title}
            </h2>

            <p className="mt-2 max-w-[560px] text-[11px] leading-relaxed text-white/80 md:text-[12px]">
              {course.description}
            </p>

            <div className="mt-4 flex items-center gap-3">
              {course.actions.primary ? (
                <button
                  type="button"
                  onClick={() => openRoute(course.actions.primary!.route, router)}
                  className="h-9 rounded-lg bg-sky-600 px-4 text-[11px] font-semibold text-white hover:bg-sky-700 active:scale-[0.99]"
                >
                  {course.actions.primary.label}
                </button>
              ) : null}

              <span className="inline-flex h-9 items-center rounded-lg bg-white/15 px-4 text-[11px] font-semibold text-white ring-1 ring-inset ring-white/20">
                {course.price ? `$${course.price}` : "Price unavailable"} • {course.cmeCredits} CME Credits
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
