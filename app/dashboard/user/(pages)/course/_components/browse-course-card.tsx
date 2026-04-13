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

export default function BrowseCourseCard({
  tag,
  title,
  description,
  coverImageUrl,
  price,
  cmeCredits,
  actions,
}: BrowseCourseItem) {
  const router = useRouter();

  return (
    <div
      className={[
        "overflow-hidden rounded-xl border border-slate-200 bg-white",
        "shadow-[0_6px_16px_rgba(15,23,42,0.06)]",
      ].join(" ")}
    >
      <div className="relative h-[120px] w-full overflow-hidden bg-gradient-to-r from-sky-700 via-slate-800 to-emerald-700">
        {coverImageUrl ? (
          <img
            src={coverImageUrl}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null}

        <div className="absolute inset-0 bg-slate-950/25" />

        <div className="absolute left-3 top-3">
          <span className="inline-flex items-center rounded-full bg-emerald-600 px-3 py-1 text-[9px] font-bold tracking-wide text-white">
            {tag}
          </span>
        </div>
      </div>

      <div className="px-4 pb-4 pt-3">
        <h3 className="text-[12px] font-extrabold leading-snug text-slate-900">
          {title}
        </h3>

        <p className="mt-1 text-[10px] leading-relaxed text-slate-500">
          {description}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <div className="text-[12px] font-extrabold text-slate-900">
            {price ? `$${price}` : "Price unavailable"}
          </div>

          <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-[9px] font-bold text-slate-600">
            {cmeCredits} CME CREDITS
          </span>
        </div>

        {actions.primary ? (
          <button
            type="button"
            onClick={() => openRoute(actions.primary!.route, router)}
            className={[
              "mt-3 h-9 w-full rounded-md bg-sky-600",
              "text-[11px] font-semibold text-white",
              "hover:bg-sky-700 active:scale-[0.99]",
            ].join(" ")}
          >
            {actions.primary.label}
          </button>
        ) : null}
      </div>
    </div>
  );
}
