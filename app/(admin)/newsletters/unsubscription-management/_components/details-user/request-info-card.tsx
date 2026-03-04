import { CalendarDays, ClipboardList } from "lucide-react";
import type { UnsubscriptionDetails } from "../../_lib/details-user-types";

export default function RequestInfoCard({ data }: { data: UnsubscriptionDetails }) {
  return (
    <section className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/60 shadow-sm">
      <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.22em] text-slate-400">
        <CalendarDays size={14} className="text-slate-300" />
        REQUEST INFORMATION
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <div>
          <p className="text-[10px] font-bold tracking-[0.22em] text-slate-400">
            DATE
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            {data.requestInfo.dateLabel}
          </p>
        </div>

        <div>
          <p className="text-[10px] font-bold tracking-[0.22em] text-slate-400">
            SOURCE
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            {data.requestInfo.sourceLabel}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-[10px] font-bold tracking-[0.22em] text-slate-400">
          FULL FEEDBACK
        </p>

        <div className="mt-3 rounded-2xl bg-slate-50 p-5 text-sm italic leading-6 text-slate-600 ring-1 ring-slate-200/70">
          “{data.requestInfo.feedback}”
        </div>
      </div>
    </section>
  );
}