import React from "react";
import { CalendarDays, RefreshCcw, Users } from "lucide-react";

import type { GetGeneralBroadcastUIViewResponse } from "@/types/admin/newsletter/general-newsletter/general-broadcast/general-broadcast-ui-view.types";

type Props = {
  data: GetGeneralBroadcastUIViewResponse;
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
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <span className="text-[#18c3b2]">{icon}</span>
      </div>

      <div className="text-base font-semibold text-slate-800">{value}</div>

      <p className="mt-2 text-sm text-slate-400">{helper}</p>
    </div>
  );
}

export default function ScheduledBroadcastViewStatsOverview({ data }: Props) {
  const { summaryCards, deliveryLogistics } = data;

  return (
    <section>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <StatCard
          icon={<Users size={18} />}
          label="Recipients"
          value={summaryCards.recipients.toLocaleString()}
          helper="Estimated total recipients"
        />

        <StatCard
          icon={<CalendarDays size={18} />}
          label="Scheduled For"
          value={summaryCards.scheduledForDisplay}
          helper={deliveryLogistics.timezone || "Timezone not available"}
        />

        <StatCard
          icon={<RefreshCcw size={18} />}
          label="Cadence"
          value={summaryCards.frequencyDisplay}
          helper={summaryCards.frequencyDisplay || "No cadence available"}
        />
      </div>
    </section>
  );
}
