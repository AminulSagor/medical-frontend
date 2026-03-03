import type { OnlinePrepMaterialsProps } from "@/types/course/course-online-details-type";

export default function OnlinePrepMaterialsCard({ heading, items }: OnlinePrepMaterialsProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_22px_rgba(15,23,42,0.06)]">
      <div className="text-[10px] font-extrabold tracking-[0.18em] text-slate-300">{heading}</div>

      <div className="mt-4 space-y-3">
        {items.map((it, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[12px] font-semibold text-slate-700"
          >
            {it.title}
          </div>
        ))}
      </div>
    </div>
  );
}