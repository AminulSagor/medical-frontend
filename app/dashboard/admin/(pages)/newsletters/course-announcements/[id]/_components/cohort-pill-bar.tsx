import { CalendarDays, Network } from "lucide-react";

type CohortPillBarProps = {
  cohort: {
    id: string;
    name: string;
    scheduledDateLabel: string;
    systemReady: boolean;
  };
};

export default function CohortPillBar({ cohort }: CohortPillBarProps) {
  return (
    <section className="rounded-2xl py-5">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 rounded-2xl bg-white px-6 py-4 shadow-sm ring-1 ring-slate-200/60">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-50 text-slate-500 ring-1 ring-slate-200/60">
            <Network size={18} />
          </div>

          <p className="text-[14px] leading-5 tracking-[0.7px] uppercase text-slate-700">
            <span className="font-bold text-slate-900">COHORT:</span>{" "}
            <span className="font-medium">{cohort.name}</span>
          </p>
        </div>

        <div className="hidden h-7 w-px bg-slate-200 md:block" />

        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-50 text-slate-500 ring-1 ring-slate-200/60">
            <CalendarDays size={18} />
          </div>

          <p className="text-[14px] leading-5 tracking-[0.7px] uppercase text-slate-700">
            <span className="font-bold text-slate-900">SCHEDULED DATE:</span>{" "}
            <span className="font-medium">{cohort.scheduledDateLabel}</span>
          </p>
        </div>

        <span
          className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-[11px] font-bold tracking-wide ring-1 ${
            cohort.systemReady
              ? "bg-emerald-50 text-emerald-700 ring-emerald-200/70"
              : "bg-amber-50 text-amber-700 ring-amber-200/70"
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              cohort.systemReady ? "bg-emerald-500" : "bg-amber-500"
            }`}
          />
          {cohort.systemReady ? "SYSTEM READY" : "NOT READY"}
        </span>
      </div>
    </section>
  );
}
