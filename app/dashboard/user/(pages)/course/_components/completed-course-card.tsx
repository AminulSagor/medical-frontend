"use client";

import { CheckCircle2, Eye, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import type { CompletedCourseItem } from "@/types/user/course/course-type";
import NetworkImageFallback from "../../../../../../utils/network-image-fallback";

function openRoute(route: string, router: ReturnType<typeof useRouter>) {
  if (!route) return;
  if (/^https?:\/\//i.test(route)) {
    window.open(route, "_blank", "noopener,noreferrer");
    return;
  }
  router.push(route);
}

export default function CompletedCourseCard({
  cmeCreditsBadge,
  title,
  subtitle,
  location,
  completedDate,
  coverImageUrl,
  actions,
}: CompletedCourseItem) {
  const router = useRouter();

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
      <div className="relative h-[118px] w-full overflow-hidden bg-slate-200">
        <NetworkImageFallback
          src={coverImageUrl}
          alt={title}
          className="h-full w-full object-cover"
          fallbackClassName="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400"
          iconClassName="h-8 w-8"
        />

        <div className="absolute left-3 top-3">
          <span className="inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-[9px] font-bold tracking-wide text-slate-900">
            {cmeCreditsBadge}
          </span>
        </div>
      </div>

      <div className="px-4 pb-4 pt-4">
        <h3 className="text-[14px] font-semibold leading-5 text-slate-900">{title}</h3>
        <p className="mt-2 text-[12px] leading-5 text-slate-500 line-clamp-2">{subtitle}</p>

        <div className="mt-3 flex items-center gap-2 text-[11px] text-emerald-600">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{completedDate}</span>
        </div>

        <div className="mt-2 flex items-start gap-2 text-[11px] text-slate-500">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sky-500" />
          <span className="line-clamp-2">{location}</span>
        </div>

        {actions.primary ? (
          <button
            type="button"
            onClick={() => openRoute(actions.primary?.route ?? "", router)}
            className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-sky-500 bg-white text-[13px] font-semibold text-sky-500 hover:bg-sky-50"
          >
            <Eye className="h-4 w-4" />
            {actions.primary.label}
          </button>
        ) : null}
      </div>
    </div>
  );
}
