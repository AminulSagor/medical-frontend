"use client";

import { Check, Eye, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import type { CompletedCourseItem } from "@/types/user/course/course-type";

function openRoute(route: string, router: ReturnType<typeof useRouter>) {
  if (!route) return;

  if (/^https?:\/\//i.test(route)) {
    window.open(route, "_blank", "noopener,noreferrer");
    return;
  }

  router.push(route);
}

export default function CompletedCourseCard({
  tag,
  title,
  completedDate,
  coverImageUrl,
  location,
  progress,
  cmeCreditsBadge,
  actions,
}: CompletedCourseItem) {
  const router = useRouter();

  return (
    <div
      className={[
        "overflow-hidden rounded-2xl border border-slate-200 bg-white",
        "shadow-[0_8px_20px_rgba(15,23,42,0.06)]",
      ].join(" ")}
    >
      <div className="relative h-[120px] w-full overflow-hidden bg-gradient-to-r from-emerald-700 via-slate-800 to-slate-900">
        {coverImageUrl ? (
          <img
            src={coverImageUrl}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null}

        <div className="absolute inset-0 bg-slate-950/35" />

        <div className="absolute left-3 top-3 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-sky-200 px-3 py-1 text-[10px] font-semibold text-slate-900">
            {cmeCreditsBadge}
          </span>
          <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-[10px] font-semibold text-white ring-1 ring-inset ring-white/20">
            {tag}
          </span>
        </div>
      </div>

      <div className="px-4 pb-4 pt-3">
        <h3 className="text-[12px] font-bold leading-snug text-slate-900">
          {title}
        </h3>

        <div className="mt-2 flex items-center gap-2 text-[10px] font-medium text-emerald-700">
          <span className="grid h-5 w-5 place-items-center rounded-full border border-emerald-200 bg-emerald-50">
            <Check className="h-3 w-3" />
          </span>
          <span className="text-emerald-700">Completed: {completedDate}</span>
        </div>

        <div className="mt-3 space-y-2 text-[11px] text-slate-600">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-sky-600" />
            <span>{location}</span>
          </div>
          <p>{progress}</p>
        </div>

        {actions.primary ? (
          <button
            type="button"
            onClick={() => openRoute(actions.primary!.route, router)}
            className={[
              "mt-4 flex h-9 w-full items-center justify-center gap-2 rounded-xl",
              "border border-sky-500 bg-white",
              "text-[11px] font-semibold text-sky-600",
              "hover:bg-sky-50 active:scale-[0.99]",
            ].join(" ")}
          >
            <Eye className="h-4 w-4" />
            {actions.primary.label}
          </button>
        ) : null}
      </div>
    </div>
  );
}
