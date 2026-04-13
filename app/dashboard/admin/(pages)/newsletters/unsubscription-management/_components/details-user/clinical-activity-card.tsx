import { History } from "lucide-react";
import { UnsubscriptionDetails } from "../../_lib/details-user-types";

function cn(...p: Array<string | false | undefined>) {
  return p.filter(Boolean).join(" ");
}

export default function ClinicalActivityCard({ data }: { data: UnsubscriptionDetails }) {
  const timeline = data.activity?.timeline ?? [];

  return (
    <section className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/60 shadow-sm">
      <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.22em] text-slate-400">
        <History size={14} className="text-slate-300" />
        CLINICAL ACTIVITY HISTORY
      </div>

      <div className="mt-6 space-y-5">
        {timeline.map((it, index) => (
          <div key={`${it.label}-${index}`} className="flex items-start gap-4">
            <div
              className={cn(
                "mt-1 h-4 w-4 rounded-full",
                it.active ? "bg-teal-500" : "bg-slate-200"
              )}
            />
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900">{it.label}</p>
              <p className="text-sm italic text-slate-500">{it.value}</p>
            </div>
          </div>
        ))}

        {timeline.length === 0 ? (
          <p className="text-sm text-slate-500">No clinical activity yet.</p>
        ) : null}
      </div>
    </section>
  );
}