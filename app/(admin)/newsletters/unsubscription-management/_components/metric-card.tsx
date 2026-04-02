import { Clock, UserX, Users } from "lucide-react";

function cn(...p: Array<string | false | undefined>) {
  return p.filter(Boolean).join(" ");
}

export default function MetricCard({
  label,
  value,
  subLabel,
  iconTone,
}: {
  label: string;
  value: number | string;
  subLabel?: string;
  iconTone?: "teal" | "blue";
}) {
  const Icon =
    label.includes("PENDING") ? UserX : label.includes("TOTAL") ? Users : Clock;

  const iconCls =
    iconTone === "blue"
      ? "bg-sky-50 text-sky-600 ring-sky-100"
      : "bg-teal-50 text-teal-600 ring-teal-100";

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/60">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold tracking-[0.22em] text-slate-400">
            {label}
          </p>

          <div className="mt-2 flex items-end gap-2">
            <p className="text-[28px] font-black leading-none text-slate-900">
              {value}
            </p>
          </div>

          {subLabel ? (
            <p className="mt-2 text-xs text-slate-500">{subLabel}</p>
          ) : null}
        </div>

        <div className={cn("grid h-10 w-10 place-items-center rounded-xl ring-1", iconCls)}>
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
}