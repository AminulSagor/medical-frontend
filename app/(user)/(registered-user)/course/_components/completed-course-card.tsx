"use client";

import Image from "next/image";
import { Check, Eye } from "lucide-react";
import type { CompletedCourseCard as CompletedCourseCardType } from "@/types/course/course-type";

export default function CompletedCourseCard({
  cmeCreditsLabel,
  title,
  completedOnText,
  imageSrc,
  onViewDetails,
}: CompletedCourseCardType) {
  return (
    <div
      className={[
        "overflow-hidden rounded-2xl border border-slate-200 bg-white",
        "shadow-[0_8px_20px_rgba(15,23,42,0.06)]",
      ].join(" ")}
    >
      {/* image */}
      <div className="relative h-[120px] w-full">
        <Image src={imageSrc} alt={title} fill className="object-cover" />

        {/* CME badge (top-left) */}
        <div className="absolute left-3 top-3">
          <span className="inline-flex items-center rounded-full bg-sky-200 px-3 py-1 text-[10px] font-semibold text-slate-900">
            {cmeCreditsLabel}
          </span>
        </div>
      </div>

      {/* content */}
      <div className="px-4 pb-4 pt-3">
        <h3 className="text-[12px] font-bold leading-snug text-slate-900">
          {title}
        </h3>

        <div className="mt-2 flex items-center gap-2 text-[10px] font-medium text-emerald-700">
          <span className="grid h-5 w-5 place-items-center rounded-full border border-emerald-200 bg-emerald-50">
            <Check className="h-3 w-3" />
          </span>
          <span className="text-emerald-700">{completedOnText}</span>
        </div>

        <button
          type="button"
          onClick={onViewDetails}
          className={[
            "mt-3 flex h-9 w-full items-center justify-center gap-2 rounded-xl",
            "border border-sky-500 bg-white",
            "text-[11px] font-semibold text-sky-600",
            "hover:bg-sky-50 active:scale-[0.99]",
          ].join(" ")}
        >
          <Eye className="h-4 w-4" />
          View Course Details
        </button>
      </div>
    </div>
  );
}