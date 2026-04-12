import { MailCheck, MousePointerClick, PackageCheck, UserMinus } from "lucide-react";

import type { TransmissionReportCards } from "@/types/admin/newsletter/dashboard/transmission-report.types";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function MetricShell({
  title,
  value,
  note,
  icon,
  accent,
}: {
  title: string;
  value: string;
  note?: string;
  icon: React.ReactNode;
  accent: "teal" | "indigo" | "amber" | "rose";
}) {
  const accentMap = {
    teal: {
      bg: "bg-[#e8fbf8]",
      text: "text-[#14b8ad]",
    },
    indigo: {
      bg: "bg-[#eef2ff]",
      text: "text-[#6366f1]",
    },
    amber: {
      bg: "bg-[#fff7ed]",
      text: "text-[#f97316]",
    },
    rose: {
      bg: "bg-[#fff1f2]",
      text: "text-[#fb7185]",
    },
  }[accent];

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
            {title}
          </p>
          <p className="mt-2 text-xl font-semibold text-slate-900 md:text-2xl">
            {value}
          </p>
          {note ? (
            <p className="mt-1 text-[11px] font-semibold text-slate-500">{note}</p>
          ) : null}
        </div>

        <div
          className={cx(
            "grid h-10 w-10 shrink-0 place-items-center rounded-xl",
            accentMap.bg,
            accentMap.text,
          )}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function MetricSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
      <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
      <div className="mt-3 h-7 w-20 animate-pulse rounded bg-slate-100" />
      <div className="mt-2 h-3 w-16 animate-pulse rounded bg-slate-100" />
    </div>
  );
}

type Props = {
  cards: TransmissionReportCards | null;
  isLoading: boolean;
};

export default function ReportMetrics({ cards, isLoading }: Props) {
  if (isLoading) {
    return (
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricSkeleton />
        <MetricSkeleton />
        <MetricSkeleton />
        <MetricSkeleton />
      </section>
    );
  }

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <MetricShell
        title="Delivery Rate"
        value={`${cards?.deliveryRatePercent ?? 0}%`}
        note="Successful delivery performance"
        icon={<PackageCheck size={18} />}
        accent="teal"
      />

      <MetricShell
        title="Open Rate"
        value={`${cards?.openRate.value ?? 0}%`}
        note={`${cards?.openRate.growthRatePercent ?? 0}% vs prior`}
        icon={<MailCheck size={18} />}
        accent="indigo"
      />

      <MetricShell
        title="Click Through Rate"
        value={`${cards?.clickThroughRatePercent ?? 0}%`}
        note="Link engagement"
        icon={<MousePointerClick size={18} />}
        accent="amber"
      />

      <MetricShell
        title="Attrition"
        value={`${cards?.attritionPercent ?? 0}%`}
        note="Unsubscribe and loss rate"
        icon={<UserMinus size={18} />}
        accent="rose"
      />
    </section>
  );
}