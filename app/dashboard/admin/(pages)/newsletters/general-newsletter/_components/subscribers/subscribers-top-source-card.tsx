import type { SubscribersSummary } from "../../types/subscribers-type";

function cn(...p: Array<string | false | undefined>) {
  return p.filter(Boolean).join(" ");
}

/** Donut exactly 48x48 */
function Donut48() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      aria-hidden="true"
      className="shrink-0"
    >
      {/* base ring */}
      <circle
        cx="24"
        cy="24"
        r="17"
        fill="none"
        stroke="rgba(148,163,184,0.14)"
        strokeWidth="6"
      />

      {/* small colored ticks */}
      {[
        { rot: -90, color: "rgba(20,184,166,1)" }, // teal
        { rot: -64, color: "rgba(99,102,241,1)" }, // indigo
        { rot: -38, color: "rgba(245,158,11,1)" }, // amber
        { rot: -12, color: "rgba(15,23,42,1)" }, // slate
        { rot: 168, color: "rgba(20,184,166,1)" },
        { rot: 194, color: "rgba(99,102,241,1)" },
        { rot: 220, color: "rgba(245,158,11,1)" },
        { rot: 246, color: "rgba(15,23,42,1)" },
      ].map((t, idx) => (
        <circle
          key={idx}
          cx="24"
          cy="24"
          r="17"
          fill="none"
          stroke={t.color}
          strokeWidth="6"
          strokeDasharray="4 200"
          transform={`rotate(${t.rot} 24 24)`}
          strokeLinecap="butt"
        />
      ))}

      {/* inner hole */}
      <circle cx="24" cy="24" r="13" fill="white" />
    </svg>
  );
}

/** Figma legend text */
function LegendItem({
  label,
  tone,
}: {
  label: string;
  tone: "teal" | "indigo" | "amber" | "slate";
}) {
  const dot =
    tone === "teal"
      ? "bg-teal-500"
      : tone === "indigo"
      ? "bg-indigo-500"
      : tone === "amber"
      ? "bg-amber-400"
      : "bg-slate-900";

  return (
    <div className="flex items-center gap-[6px]">
      <span className={cn("h-[10px] w-[10px] rounded-full", dot)} />
      <span
        className="text-[9px] font-bold leading-[13.5px] text-slate-600"
        style={{ paddingRight: 5.5 }}
      >
        {label}
      </span>
    </div>
  );
}

export default function SubscribersTopSourceCard({
  summary,
}: {
  summary: SubscribersSummary;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-white p-4",
        "shadow-sm",
        "ring-1 ring-slate-200/60"
      )}
      style={{
        width: 300,
        height: 125,
      }}
    >
      <p className="text-[10px] font-bold tracking-[0.22em] text-slate-400">
        TOP SOURCE
      </p>

      <div className="mt-3 flex items-center gap-6">
        <Donut48 />

        {/* compact legend like figma */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-2">
          <LegendItem label="Footer" tone="teal" />
          <LegendItem label="Webinar" tone="slate" />
          <LegendItem label="Popup" tone="indigo" />
          <LegendItem label="Checkout" tone="amber" />
        </div>
      </div>
    </div>
  );
}