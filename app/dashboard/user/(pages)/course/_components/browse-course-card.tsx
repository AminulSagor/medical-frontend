"use client";

import { useRouter } from "next/navigation";
import type { BrowseCourseItem } from "@/types/user/course/course-type";
import NetworkImageFallback from "../../../../../../utils/network-image-fallback";

function openRoute(route: string, router: ReturnType<typeof useRouter>) {
  if (!route) return;
  if (/^https?:\/\//i.test(route)) {
    window.open(route, "_blank", "noopener,noreferrer");
    return;
  }
  router.push(route);
}

function formatBrowsePrice(price?: string | null) {
  if (!price || price.trim() === "") return "price unavailable";
  const amount = Number.parseFloat(price);
  if (Number.isNaN(amount)) return "price unavailable";
  return `$${amount.toFixed(2)}`;
}

export default function BrowseCourseCard({
  courseType,
  tag,
  title,
  description,
  coverImageUrl,
  price,
  cmeCreditsLabel,
  actions,
}: BrowseCourseItem) {
  const router = useRouter();
  const isOnline = courseType === "online";

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
      <div className="relative h-[130px] w-full overflow-hidden bg-slate-200">
        <NetworkImageFallback
          src={coverImageUrl}
          alt={title}
          className="h-full w-full object-cover"
          fallbackVariant="cover"
          fallbackClassName="h-full w-full"
          iconClassName="h-8 w-8"
        />

        <div className="absolute left-3 top-3">
          <span
            className={[
              "inline-flex items-center rounded-full px-3 py-1 text-[9px] font-bold tracking-wide text-white",
              isOnline ? "bg-sky-500" : "bg-emerald-500",
            ].join(" ")}
          >
            {tag}
          </span>
        </div>
      </div>

      <div className="px-4 pb-4 pt-4">
        <h3 className="text-[14px] font-semibold leading-6 text-slate-900 line-clamp-2 min-h-[3rem]">{title}</h3>
        <p className="mt-2 min-h-[40px] text-[12px] leading-5 text-slate-500 line-clamp-2">{description}</p>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div className="text-[14px] font-semibold text-slate-900">{formatBrowsePrice(price)}</div>
          <span className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
            {cmeCreditsLabel}
          </span>
        </div>

        <button
          type="button"
          onClick={() => openRoute(actions.primary?.route ?? "", router)}
          className="mt-4 h-10 w-full rounded-lg bg-sky-500 text-[13px] font-semibold text-white hover:bg-sky-600"
        >
          View Details
        </button>
      </div>
    </div>
  );
}
