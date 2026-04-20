import ScheduledBroadcastSectionShell from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/view-scheduled-broadcast/[broadcastId]/_components/scheduled-broadcast-section-shell";
import type { BroadcastUIContentOverview } from "@/types/admin/newsletter/general-newsletter/general-broadcast/general-broadcast-ui-view.types";

type Props = {
  data?: BroadcastUIContentOverview | null;
};

function FieldBlock({
  label,
  value,
  italic,
}: {
  label: string;
  value: string;
  italic?: boolean;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-slate-500">{label}</p>
      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
        <p
          className={`text-sm text-slate-700 ${
            italic ? "italic" : "font-medium"
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

export default function ScheduledBroadcastContentOverviewCard({ data }: Props) {
  return (
    <ScheduledBroadcastSectionShell title="Content Overview">
      <div className="space-y-4">
        <FieldBlock label="Subject Line" value={data?.subjectLine || "-"} />
        <FieldBlock
          label="Pre-header"
          value={data?.preheaderText || "-"}
          italic
        />
      </div>
    </ScheduledBroadcastSectionShell>
  );
}
