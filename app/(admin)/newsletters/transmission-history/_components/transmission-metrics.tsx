import { TransmissionMetricCard } from "@/app/(admin)/newsletters/transmission-history/types/transmission-history.type";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function accentStyles(accent?: TransmissionMetricCard["accent"]) {
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

function Delta({
  tone,
  label,
}: {
  tone?: TransmissionMetricCard["deltaTone"];
  label?: string;
}) {
  if (!label) return null;

  const cls =
    tone === "up"
      ? "text-[#14b8ad]"
      : tone === "down"
        ? "text-rose-500"
        : "text-slate-400";

  return <span className={cx("text-xs font-semibold", cls)}>{label}</span>;
}

export default function TransmissionMetrics({
  items,
}: {
  items: TransmissionMetricCard[];
}) {
  return (
    <section className="px-4 md:px-6">
      <div className="mx-auto w-full">
        <div className="grid gap-4 md:grid-cols-3">
          {items.map((m) => {
            const a = accentStyles(m.accent);
            return (
              <div
                key={m.key}
                className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.05)]"
              >
                <div
                  className={cx(
                    "pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full blur-2xl",
                    a.glow,
                  )}
                />

                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  {m.label}
                </p>

                <div className="mt-2 flex items-end gap-3">
                  <p className="text-[30px] font-semibold leading-none text-slate-900">
                    {m.value}
                  </p>
                  <Delta tone={m.deltaTone} label={m.deltaLabel} />
                  {m.noteLabel ? (
                    <span className="pb-[2px] text-xs font-semibold text-slate-500">
                      {m.noteLabel}
                    </span>
                  ) : null}
                </div>

                <div className="absolute right-5 top-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-100 bg-white">
                    <span className={cx("text-[18px] font-bold", a.icon)}>
                      {m.key === "totalSent"
                        ? "➤"
                        : m.key === "avgOpenRate"
                          ? "✉"
                          : "!"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
