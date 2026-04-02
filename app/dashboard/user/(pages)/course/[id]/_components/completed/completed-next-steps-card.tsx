"use client";

import type { CompletedNextStepsCardProps } from "@/types/user/course/course-completed-details-type";

export default function CompletedNextStepsCardClient({
  title,
  text,
  actionLabel,
}: CompletedNextStepsCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="text-[13px] font-extrabold text-slate-900">{title}</div>
      <div className="mt-2 text-[12px] leading-relaxed text-slate-500">
        {text}
      </div>

      <button
        type="button"
        onClick={() => {}}
        className="mt-4 text-[12px] font-extrabold text-[#35BEEA] hover:opacity-90"
      >
        {actionLabel}
      </button>
    </div>
  );
}
