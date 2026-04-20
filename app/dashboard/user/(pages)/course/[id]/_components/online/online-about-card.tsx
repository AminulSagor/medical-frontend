import type { OnlineAboutCardProps } from "@/types/user/course/course-online-details-type";

export default function OnlineAboutCard({
  heading,
  paragraph,
  learningObjectivesTitle,
  learningObjectivesHtml,
}: OnlineAboutCardProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_22px_rgba(15,23,42,0.06)]">
      <div className="text-[10px] font-extrabold tracking-[0.18em] text-slate-300">
        {heading}
      </div>

      {paragraph ? (
        <p className="mt-4 text-[12px] leading-relaxed text-slate-600">{paragraph}</p>
      ) : null}

      {learningObjectivesHtml ? (
        <div className="mt-5">
          <div className="text-[10px] font-extrabold tracking-[0.18em] text-slate-300">
            {learningObjectivesTitle || "LEARNING OBJECTIVES"}
          </div>
          <div
            className="mt-3 text-[12px] leading-relaxed text-slate-600 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_li]:pl-1 [&_a]:text-sky-600 [&_a]:underline"
            dangerouslySetInnerHTML={{ __html: learningObjectivesHtml }}
          />
        </div>
      ) : null}
    </section>
  );
}
