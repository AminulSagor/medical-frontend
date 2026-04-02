import ScheduledBroadcastSectionShell from "@/app/dashboard/admin/(pages)/newsletters/view-scheduled-broadcast/_components/scheduled-broadcast-section-shell";
import { ContentOverviewData } from "@/app/dashboard/admin/(pages)/newsletters/view-scheduled-broadcast/types/scheduled-broadcast-view.type";

type Props = {
  data: ContentOverviewData;
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
      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>
      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
        <p
          className={`text-[15px] text-slate-700 ${italic ? "italic" : "font-medium"}`}
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
      <div className="space-y-5">
        <FieldBlock label="Subject Line" value={data.subjectLine} />
        <FieldBlock label="Pre-Header" value={data.preHeader} italic />
      </div>
    </ScheduledBroadcastSectionShell>
  );
}
