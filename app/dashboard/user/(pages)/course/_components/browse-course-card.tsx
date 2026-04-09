"use client";

import Image from "next/image";
import type { BrowseCourseCardItem } from "@/types/user/course/course-type";
import { useRouter } from "next/navigation";

export default function BrowseCourseCard({
  badge,
  title,
  description,
  imageSrc,
  priceLabel,
  creditsLabel,
  ctaLabel,
  onCta,
}: BrowseCourseCardItem) {
  const router = useRouter();
  return (
    <div
      className={[
        "overflow-hidden rounded-xl border border-slate-200 bg-white",
        "shadow-[0_6px_16px_rgba(15,23,42,0.06)]",
      ].join(" ")}
    >
      <div className="relative h-[120px] w-full">
        <Image src={imageSrc} alt={title} fill className="object-cover" />

        <div className="absolute left-3 top-3">
          <span className="inline-flex items-center rounded-full bg-emerald-600 px-3 py-1 text-[9px] font-bold tracking-wide text-white">
            {badge}
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
            {priceLabel}
          </div>

          <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-[9px] font-bold text-slate-600">
            {creditsLabel}
          </span>
        </div>

        <button
          type="button"
          onClick={() => router.push(`/course/online`)}
          className={[
            "mt-3 h-9 w-full rounded-md bg-sky-600",
            "text-[11px] font-semibold text-white",
            "hover:bg-sky-700 active:scale-[0.99]",
          ].join(" ")}
        >
          {ctaLabel}
        </button>
      </div>
    </div>
  );
}
