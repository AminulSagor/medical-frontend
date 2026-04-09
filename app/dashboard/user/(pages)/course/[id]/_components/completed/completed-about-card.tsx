import type { CompletedAboutProps } from "@/types/user/course/course-completed-details-type";

export default function CompletedAboutCard({
  heading,
  paragraphs,
}: CompletedAboutProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="text-[13px] font-extrabold text-slate-900">{heading}</div>

      <div className="mt-3 space-y-3 text-[12px] leading-relaxed text-slate-500">
        {paragraphs.map((p, idx) => (
          <p key={idx}>{p}</p>
        ))}
      </div>
    </section>
  );
}
