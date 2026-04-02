"use client";

import type { CourseAboutCardProps } from "@/types/user/course/course-details-type";

export default function CourseAboutCard({
  title,
  paragraphs,
}: CourseAboutCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
      <div className="text-[12px] font-semibold text-slate-900">{title}</div>
      <div className="mt-3 space-y-3 text-[12px] leading-relaxed text-slate-600">
        {paragraphs.map((p, idx) => (
          <p key={idx}>{p}</p>
        ))}
      </div>
    </div>
  );
}
