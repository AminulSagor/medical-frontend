import React from "react";
import { CalendarDays, Clock3 } from "lucide-react";

import ScheduledBroadcastSectionShell from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/view-scheduled-broadcast/[broadcastId]/_components/scheduled-broadcast-section-shell";
import {
  formatDateOnly,
  formatFrequencyType,
  formatTimeOnly,
} from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/view-scheduled-broadcast/[broadcastId]/_utils/scheduled-broadcast-view.utils";
import type { GetGeneralBroadcastResponse } from "@/types/admin/newsletter/general-newsletter/general-broadcast/general-broadcast-get.types";

type Props = {
  data: GetGeneralBroadcastResponse;
};

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
      {children}
    </p>
  );
}

function ReadonlyField({
  icon,
  value,
  muted,
}: {
  icon: React.ReactNode;
  value: string;
  muted?: boolean;
}) {
  return (
    <div
      className={`flex h-12 items-center gap-3 rounded-xl border px-4 ${
        muted
          ? "border-slate-200 bg-slate-50 text-slate-500"
          : "border-slate-200 bg-white text-slate-700"
      }`}
    >
      <span className="text-slate-400">{icon}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

export default function ScheduledBroadcastDeliveryLogisticsCard({
  data,
}: Props) {
  return (
    <ScheduledBroadcastSectionShell title="Delivery Logistics">
      <div className="space-y-5">
        <div>
          <Label>Selected Cadence</Label>
          <div className="rounded-2xl border border-[#bfeee8] bg-[#f4fffd] p-4">
            <div className="flex items-start gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#dff7f4] text-[#14b8ad]">
                <CalendarDays size={18} />
              </span>

              <div>
                <p className="text-[15px] font-semibold text-slate-800">
                  {formatFrequencyType(data.frequencyType)}
                </p>
                <p className="text-sm text-slate-500">
                  {data.cadenceAnchorLabel || "No cadence anchor available"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <Label>Available Cadence Date</Label>
          <ReadonlyField
            icon={<CalendarDays size={16} />}
            value={formatDateOnly(data.scheduledAt)}
          />
        </div>

        <div>
          <Label>Scheduled Time</Label>
          <ReadonlyField
            icon={<Clock3 size={16} />}
            value={formatTimeOnly(data.scheduledAt)}
            muted
          />
          <p className="mt-2 text-[11px] text-slate-400">
            {data.timezone || "Timezone not available"}
          </p>
        </div>
      </div>
    </ScheduledBroadcastSectionShell>
  );
}
