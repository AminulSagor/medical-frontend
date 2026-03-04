import { CalendarDays, Network } from "lucide-react";
import type { CohortInfo } from "../_lib/compose-types";

export default function CohortPillBar({ cohort }: { cohort: CohortInfo }) {
  return (
    <section className="rounded-2xl py-5">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 rounded-2xl bg-white px-6 py-4 shadow-sm ring-1 ring-slate-200/60">
        {/* Left: COHORT */}
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-50 text-slate-500 ring-1 ring-slate-200/60">
            <Network size={18} />
          </div>

          <p className="text-[14px] leading-5 tracking-[0.7px] uppercase text-slate-700">
            <span className="font-bold text-slate-900">COHORT:</span>{" "}
            <span className="font-medium">{cohort.titleUpper}</span>
          </p>
        </div>

        {/* Divider */}
        <div className="hidden h-7 w-px bg-slate-200 md:block" />

        {/* Middle: DATE */}
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-50 text-slate-500 ring-1 ring-slate-200/60">
            <CalendarDays size={18} />
          </div>

          <p className="text-[14px] leading-5 tracking-[0.7px] uppercase text-slate-700">
            <span className="font-bold text-slate-900">SCHEDULED DATE:</span>{" "}
            <span className="font-medium">{cohort.scheduledDateLabel}</span>
          </p>
        </div>

        {/* Right: STATUS */}
        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-5 py-2 text-[11px] font-bold tracking-wide text-emerald-700 ring-1 ring-emerald-200/70">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          {cohort.systemReady ? "SYSTEM READY" : "NOT READY"}
        </span>
      </div>
    </section>
  );
}