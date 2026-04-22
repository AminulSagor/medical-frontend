import ScheduledBroadcastSectionShell from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/view-scheduled-broadcast/[broadcastId]/_components/scheduled-broadcast-section-shell";
import { getAudienceItems } from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/view-scheduled-broadcast/[broadcastId]/_utils/scheduled-broadcast-view.utils";
import type { BroadcastUIAudience } from "@/types/admin/newsletter/general-newsletter/general-broadcast/general-broadcast-ui-view.types";

type Props = {
  audience: BroadcastUIAudience;
};

export default function ScheduledBroadcastAudienceTargetCard({
  audience,
}: Props) {
  const items = getAudienceItems(audience);

  if (items.length === 0) {
    return (
      <ScheduledBroadcastSectionShell title="Audience & Target">
        <p className="flex flex-wrap gap-2 text-slate-700">{audience.mode}</p>
      </ScheduledBroadcastSectionShell>
    );
  }
  return (
    <ScheduledBroadcastSectionShell title="Audience & Target">
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item.id}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#14b8ad]" />
            {item.label}
          </span>
        ))}
      </div>
    </ScheduledBroadcastSectionShell>
  );
}
