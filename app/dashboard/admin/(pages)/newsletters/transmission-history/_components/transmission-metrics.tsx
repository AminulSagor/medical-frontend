import type { TransmissionHistoryCards } from "@/types/admin/newsletter/dashboard/transmission-history.types";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function formatPercent(value: number) {
  return `${value}%`;
}

function formatDecimalPercent(value: number) {
  return `${value}%`;
}

function accentStyles(accent: "teal" | "indigo" | "rose") {
  if (accent === "teal") {
    return {
      glow: "bg-[#e8fbf8]",
      icon: "text-[#14b8ad]",
    };
  }

  if (accent === "indigo") {
    return {
      glow: "bg-[#eef2ff]",
      icon: "text-[#6366f1]",
    };
  }

  return {
    glow: "bg-[#fff1f2]",
    icon: "text-[#fb7185]",
  };
}

function MetricCard({
  label,
  value,
  accent,
  deltaLabel,
  noteLabel,
  icon,
}: {
  label: string;
  value: string;
  accent: "teal" | "indigo" | "rose";
  deltaLabel?: string;
  noteLabel?: string;
  icon: string;
}) {
  const a = accentStyles(accent);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
      <div
        className={cx(
          "pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full blur-2xl",
          a.glow,
        )}
      />

      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
        {label}
      </p>

      <div className="mt-2 flex items-end gap-3">
        <p className="text-[30px] font-semibold leading-none text-slate-900">
          {value}
        </p>

        {deltaLabel ? (
          <span className="text-xs font-semibold text-[#14b8ad]">
            {deltaLabel}
          </span>
        ) : null}

        {noteLabel ? (
          <span
            className={cx(
              "pb-[2px] text-xs font-semibold",
              accent === "rose" ? "text-rose-500" : "text-[#6366f1]",
            )}
          >
            {noteLabel}
          </span>
        ) : null}
      </div>

      <div className="absolute right-5 top-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-100 bg-white">
          <span className={cx("text-[18px] font-bold", a.icon)}>{icon}</span>
        </div>
      </div>
    </div>
  );
}

function MetricCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
      <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />
      <div className="mt-4 h-8 w-28 animate-pulse rounded bg-slate-100" />
    </div>
  );
}

type Props = {
  cards: TransmissionHistoryCards | null;
  isLoading: boolean;
};

export default function TransmissionMetrics({ cards, isLoading }: Props) {
  if (isLoading) {
    return (
      <section className="px-4 md:px-6">
        <div className="mx-auto w-full">
          <div className="grid gap-4 md:grid-cols-3">
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 md:px-6">
      <div className="mx-auto w-full">
        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard
            label="Total Sent"
            value={`${cards?.totalSent.value ?? 0}`}
            accent="teal"
            deltaLabel={`${cards?.totalSent.growthRatePercent ?? 0}%`}
            icon="➤"
          />

          <MetricCard
            label="Avg. Open Rate"
            value={formatPercent(cards?.avgOpenRatePercent ?? 0)}
            accent="indigo"
            noteLabel="Industry Leading"
            icon="✉"
          />

          <MetricCard
            label="Bounces"
            value={formatDecimalPercent(cards?.bounceRatePercent ?? 0)}
            accent="rose"
            noteLabel="Low Risk"
            icon="!"
          />
        </div>
      </div>
    </section>
  );
}
