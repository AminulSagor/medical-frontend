import type { ReactNode } from "react";

function cx(...parts: Array<string | false | null | undefined>) {
    return parts.filter(Boolean).join(" ");
}

type StatCardProps = {
    label: string;
    value: string;
    sub?: string;
    icon: ReactNode;
    iconTone?: "teal" | "dark" | "slate";
};

export default function StatCard({
    label,
    value,
    sub,
    icon,
    iconTone = "teal",
}: StatCardProps) {
    const tone =
        iconTone === "dark"
            ? "bg-slate-900 text-white"
            : iconTone === "slate"
                ? "bg-white text-slate-700 ring-1 ring-slate-200"
                : "bg-[var(--primary-50)] text-[var(--primary)] ring-1 ring-[var(--primary)]/15";

    return (
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/60">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        {label}
                    </p>
                    <p className="mt-2 text-2xl font-extrabold text-slate-900">
                        {value}
                    </p>
                    {sub ? <p className="mt-1 text-xs text-slate-500">{sub}</p> : null}
                </div>
                <div
                    className={cx("grid h-12 w-12 place-items-center rounded-2xl", tone)}
                >
                    {icon}
                </div>
            </div>
        </div>
    );
}