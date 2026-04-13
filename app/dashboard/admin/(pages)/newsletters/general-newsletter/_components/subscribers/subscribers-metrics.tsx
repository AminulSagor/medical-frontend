import { TrendingUp, Zap, HeartCrack } from "lucide-react";
import type { SubscribersSummary } from "../../types/subscribers-type";

function cn(...p: Array<string | false | undefined>) {
  return p.filter(Boolean).join(" ");
}

function MetricCard({
  title,
  value,
  subLeft,
  subRight,
  icon,
  pill,
}: {
  title: string;
  value: string;
  subLeft?: string;
  subRight?: string;
  icon: React.ReactNode;
  pill?: { label: string; tone?: "teal" | "red" | "slate" };
}) {
  const pillCls =
    pill?.tone === "red"
      ? "bg-rose-50 text-rose-600"
      : pill?.tone === "teal"
        ? "bg-teal-50 text-teal-700"
        : "bg-slate-50 text-slate-600";

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/60">
      <div className="flex items-start justify-between">
        <p className="text-[10px] font-bold tracking-[0.22em] text-slate-400">
          {title}
        </p>
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-50 text-slate-500 ring-1 ring-slate-200/60">
          {icon}
        </div>
      </div>

      <div className="mt-3 flex items-end gap-3">
        <p className="text-[24px] font-extrabold leading-8 text-slate-900">
          {value}
        </p>

        {pill ? (
          <span
            className={cn(
              "rounded-full px-3 py-1 text-[10px] font-bold",
              pillCls,
            )}
          >
            {pill.label}
          </span>
        ) : null}
      </div>

      {(subLeft || subRight) && (
        <div className="mt-2 flex items-center gap-3 text-[10px] font-bold">
          {subLeft ? <span className="text-teal-600">{subLeft}</span> : null}
          {subRight ? <span className="text-slate-400">{subRight}</span> : null}
        </div>
      )}
    </div>
  );
}

export default function SubscribersMetrics({
  summary,
}: {
  summary: SubscribersSummary;
}) {
  return (
    <>
      <MetricCard
        title="NET GROWTH"
        value={`${summary.netGrowth}`}
        icon={<TrendingUp size={16} />}
        pill={{ label: summary.netGrowthLabel, tone: "teal" }}
        subLeft={summary.netGrowthDeltaLabel}
      />

      <MetricCard
        title="AVG. ENGAGEMENT"
        value={`${summary.avgEngagement}%`}
        icon={<Zap size={16} />}
        subLeft={summary.avgEngagementLeftLabel}
        subRight={summary.avgEngagementRightLabel}
      />

      <MetricCard
        title="LIST HEALTH"
        value={`${summary.listHealthUnsubscribes}`}
        icon={<HeartCrack size={16} />}
        subLeft={summary.listHealthSubLabelLeft}
        subRight={summary.listHealthDeltaLabel}
      />
    </>
  );
}