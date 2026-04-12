import type { TransmissionReportEngagementOverTime } from "@/types/admin/newsletter/dashboard/transmission-report.types";

function ChartSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="h-4 w-44 animate-pulse rounded bg-slate-100" />
      <div className="mt-1 h-3 w-28 animate-pulse rounded bg-slate-100" />
      <div className="mt-6 h-[260px] animate-pulse rounded-xl bg-slate-100" />
    </div>
  );
}

type Props = {
  engagement: TransmissionReportEngagementOverTime | null;
  isLoading: boolean;
};

export default function EngagementOverTimeCard({
  engagement,
  isLoading,
}: Props) {
  if (isLoading) {
    return <ChartSkeleton />;
  }

  const buckets = engagement?.buckets ?? [];
  const max = Math.max(...buckets, 1);

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <div>
        <h2 className="text-sm font-semibold text-slate-900">
          Engagement Overview
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Activity distribution across {engagement?.unit ?? "time"} intervals
        </p>
      </div>

      <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50/60 p-4">
        <div className="flex h-[260px] items-end gap-2 overflow-hidden">
          {buckets.map((value, index) => {
            const height = `${Math.max((value / max) * 100, value > 0 ? 6 : 2)}%`;

            return (
              <div
                key={`${index}-${value}`}
                className="flex h-full flex-1 flex-col items-center justify-end gap-2"
              >
                <div
                  className="w-full rounded-t-md bg-[var(--primary)]/85"
                  style={{ height }}
                  title={`Hour ${index}: ${value}`}
                />
                <span className="text-[10px] font-medium text-slate-400">
                  {index}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}