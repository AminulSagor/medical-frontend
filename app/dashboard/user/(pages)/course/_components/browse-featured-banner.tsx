"use client";

import { useRouter } from "next/navigation";
import type { BrowseCourseItem } from "@/types/user/course/course-type";
import NetworkImageFallback from "../../../_components/network-image-fallback";

function openRoute(route: string, router: ReturnType<typeof useRouter>) {
  if (!route) return;
  if (/^https?:\/\//i.test(route)) {
    window.open(route, "_blank", "noopener,noreferrer");
    return;
  }
  router.push(route);
}

function formatFeaturedPrice(price?: string | null) {
  if (!price || price.trim() === "") return "Enroll Now";
  const amount = Number.parseFloat(price);
  if (Number.isNaN(amount)) return "Enroll Now";
  return `Enroll Now - $${amount.toFixed(0)}`;
}

export default function BrowseFeaturedBanner({
  course,
}: {
  course: BrowseCourseItem;
}) {
  const router = useRouter();

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
      <div className="relative h-[228px] w-full overflow-hidden bg-slate-900 md:h-[230px]">
        <NetworkImageFallback
          src={course.coverImageUrl}
          alt={course.title}
          className="h-full w-full object-cover"
          fallbackClassName="flex h-full w-full items-center justify-center bg-slate-800 text-slate-400"
          iconClassName="h-10 w-10"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/55 to-slate-950/15" />

        <div className="absolute inset-0 px-8 py-6 text-white">
          <span className="inline-flex items-center rounded-full bg-sky-500 px-3 py-1 text-[10px] font-bold tracking-wide text-white">
            FEATURED COURSE
          </span>

          <h2 className="mt-4 max-w-[360px] text-[22px] font-semibold leading-tight md:text-[24px]">
            {course.title}
          </h2>

          <p className="mt-3 max-w-[460px] text-[12px] leading-6 text-white/85">
            {course.description}
          </p>

          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              onClick={() => openRoute(course.actions.primary?.route ?? "", router)}
              className="inline-flex h-11 items-center rounded-xl bg-sky-500 px-4 text-[13px] font-semibold text-white hover:bg-sky-600"
            >
              {formatFeaturedPrice(course.price)}
            </button>

            <button
              type="button"
              onClick={() => openRoute(course.actions.primary?.route ?? "", router)}
              className="inline-flex h-11 items-center rounded-xl border border-white/20 bg-white/10 px-4 text-[13px] font-semibold text-white backdrop-blur-sm hover:bg-white/15"
            >
              View Syllabus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
