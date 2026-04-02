import { Check } from "lucide-react";
import type { OnlineAboutCardProps } from "@/types/course/course-online-details-type";

export default function OnlineAboutCard({ heading, paragraph, highlights }: OnlineAboutCardProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_22px_rgba(15,23,42,0.06)]">
      <div className="text-[10px] font-extrabold tracking-[0.18em] text-slate-300">{heading}</div>

      <p className="mt-4 text-[12px] leading-relaxed text-slate-600">{paragraph}</p>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {highlights.map((h, idx) => (
          <div key={idx} className="flex items-start gap-2 text-[12px] text-slate-600">
            <span className="mt-[2px] grid h-5 w-5 place-items-center rounded-full bg-sky-50 text-sky-600 ring-1 ring-sky-100">
              <Check className="h-3.5 w-3.5" />
            </span>
            <span className="font-medium">{h.text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}