"use client";

import type { CourseAboutCardProps } from "@/types/user/course/course-details-type";

export default function CourseAboutCard({
  title,
  paragraphs,
  learningObjectivesTitle,
  learningObjectivesHtml,
}: CourseAboutCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-slate-300">{title}</div>
      <div className="mt-3 space-y-3 text-[12px] leading-relaxed text-slate-600">
        {paragraphs.map((p, idx) => (
          <p key={idx}>{p}</p>
        ))}
      </div>

      {learningObjectivesHtml ? (
        <div className="mt-5">
          <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-slate-300">
            {learningObjectivesTitle || "LEARNING OBJECTIVES"}
          </div>
          <div
            className="mt-3 text-[12px] leading-relaxed text-slate-600 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_li]:pl-1 [&_a]:text-sky-600 [&_a]:underline"
            dangerouslySetInnerHTML={{ __html: learningObjectivesHtml }}
          />
        </div>
      ) : null}
    </div>
  );
}
