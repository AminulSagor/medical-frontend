import React from "react";
import { CalendarDays, RefreshCcw, Users } from "lucide-react";
import { OverviewStatItem } from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/view-scheduled-broadcast/[broadcastId]/types/scheduled-broadcast-view.type";

type Props = {
  items: OverviewStatItem[];
};

function getIcon(key: OverviewStatItem["key"]) {
  if (key === "recipients") return <Users size={18} />;
  if (key === "scheduled_for") return <CalendarDays size={18} />;
  return <RefreshCcw size={18} />;
}

function StatCard({ item }: { item: OverviewStatItem }) {
  return (
    <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
      <div className="mb-4 flex items-start justify-between">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
          {item.label}
        </p>
        <span className="text-[#9de4dc]">{getIcon(item.key)}</span>
      </div>

      <div className="text-[26px] font-semibold leading-tight text-slate-800">
        {item.value}
      </div>

      <p className="mt-2 text-sm text-slate-500">{item.helper}</p>
    </div>
  );
}

export default function ScheduledBroadcastViewStatsOverview({ items }: Props) {
  return (
    <section>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {items.map((item) => (
          <StatCard key={item.key} item={item} />
        ))}
      </div>
    </section>
  );
}
