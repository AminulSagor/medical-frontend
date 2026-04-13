import React from "react";
import { CalendarDays, RefreshCcw, Users } from "lucide-react";

import {
  formatDateTime,
  formatFrequencyType,
} from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/view-scheduled-broadcast/[broadcastId]/_utils/scheduled-broadcast-view.utils";
import type { GetGeneralBroadcastResponse } from "@/types/admin/newsletter/general-newsletter/general-broadcast/general-broadcast-get.types";

type Props = {
  data: GetGeneralBroadcastResponse;
};

function StatCard({
  icon,
  label,
  value,
  helper,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
      <div className="mb-4 flex items-start justify-between">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
          {label}
        </p>
        <span className="text-[#9de4dc]">{icon}</span>
      </div>

      <div className="text-[26px] font-semibold leading-tight text-slate-800">
        {value}
      </div>

      <p className="mt-2 text-sm text-slate-500">{helper}</p>
    </div>
  );
}

export default function ScheduledBroadcastViewStatsOverview({ data }: Props) {
  return (
    <section>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <StatCard
          icon={<Users size={18} />}
          label="Recipients"
          value={data.estimatedRecipientsCount.toLocaleString()}
          helper="Estimated total recipients"
        />

        <StatCard
          icon={<CalendarDays size={18} />}
          label="Scheduled For"
          value={formatDateTime(data.scheduledAt)}
          helper={data.timezone || "Timezone not available"}
        />

        <StatCard
          icon={<RefreshCcw size={18} />}
          label="Cadence"
          value={formatFrequencyType(data.frequencyType)}
          helper={data.cadenceAnchorLabel || "No cadence anchor available"}
        />
      </div>
    </section>
  );
}
