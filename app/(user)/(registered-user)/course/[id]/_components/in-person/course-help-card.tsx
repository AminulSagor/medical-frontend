"use client";

import type { CourseHelpCardProps } from "@/types/course/course-details-type";

export default function CourseHelpCard(
  props: CourseHelpCardProps & { onContactSupport: () => void }
) {
  const { title, subtitle, actionLabel, onContactSupport } = props;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
      <div className="text-[12px] font-semibold text-slate-900">{title}</div>
      <p className="mt-2 text-[12px] leading-relaxed text-slate-500">{subtitle}</p>

      <button
        type="button"
        onClick={onContactSupport}
        className="mt-4 h-10 w-full rounded-xl bg-sky-600 text-[12px] font-semibold text-white hover:bg-sky-700 active:scale-[0.99]"
      >
        {actionLabel}
      </button>
    </div>
  );
}