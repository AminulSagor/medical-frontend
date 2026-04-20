import { Eye } from "lucide-react";
import type { ReactNode } from "react";

function StatCard({
    label,
    value,
    sub,
    icon,
}: {
    label: string;
    value: string;
    sub?: string;
    icon?: ReactNode;
}) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        {label}
                    </p>
                    <p className="mt-1 text-lg font-bold text-slate-900">{value}</p>
                    {sub ? <p className="mt-0.5 text-xs text-slate-500">{sub}</p> : null}
                </div>

                {icon ? (
                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--primary-50)] text-[var(--primary)] ring-1 ring-[var(--primary)]/15">
                        {icon}
                    </div>
                ) : null}
            </div>
        </div>
    );
}

export default function CourseDetailsStats({
    capacityUsed,
    capacityTotal,
    refundRequests,
    revenueGenerated,
}: {
    capacityUsed: number;
    capacityTotal: number;
    refundRequests: number;
    revenueGenerated: number;
}) {
    const safeRevenueGenerated = Number(revenueGenerated ?? 0);

    const pct =
        capacityTotal <= 0
            ? 0
            : Math.min(100, Math.round((capacityUsed / capacityTotal) * 100));

    return (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <StatCard
                label="Total Enrolled"
                value={`${capacityUsed}/${capacityTotal}`}
                sub={`${pct}% Capacity`}
                icon={<Eye size={18} />}
            />

            <StatCard
                label="Refund Requests"
                value={`${refundRequests}`}
                sub={refundRequests > 0 ? "Pending review" : "None"}
                icon={<span className="text-sm font-bold">$</span>}
            />

            <StatCard
                label="Revenue Generated"
                value={`$${safeRevenueGenerated.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                sub="Processed"
                icon={<span className="text-sm font-bold">$</span>}
            />
        </div>
    );
}