import {
    DollarSign,
    Users,
    GraduationCap,
    ShoppingBag,
} from "lucide-react";

import type { DashboardKpis } from "@/types/admin/dashboard.types";

function formatValue(value: number, currency?: string) {
    if (currency) {
        return `${currency}${value.toLocaleString()}`;
    }

    return value.toLocaleString();
}

function Card({
    title,
    value,
    sub,
    icon: Icon,
    badge,
    badgeTone,
}: {
    title: string;
    value: string;
    sub: string;
    icon: React.ElementType;
    badge?: string;
    badgeTone?: "green" | "red";
}) {
    const tone =
        badgeTone === "red"
            ? "bg-rose-50 text-rose-700 ring-1 ring-rose-100"
            : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100";

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-xs text-slate-500">{title}</p>
                    <p className="mt-1 text-xl font-semibold text-slate-900">{value}</p>
                    <p className="mt-1 text-xs text-slate-500">{sub}</p>
                </div>

                <div className="flex flex-col items-end gap-2">
                    {badge ? (
                        <span
                            className={`rounded-full px-2 py-1 text-[11px] font-semibold ${tone}`}
                        >
                            {badge}
                        </span>
                    ) : null}

                    <div className="grid h-9 w-9 place-items-center rounded-md bg-slate-50 text-slate-600 ring-1 ring-slate-100">
                        <Icon size={16} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function StatCards({ kpis }: { kpis: DashboardKpis }) {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <Card
                title="Total Revenue"
                value={formatValue(kpis.totalRevenue.value, kpis.totalRevenue.currency)}
                sub={kpis.totalRevenue.subtext}
                icon={DollarSign}
                badge={kpis.totalRevenue.changePercent}
                badgeTone={
                    kpis.totalRevenue.changeDirection === "down" ? "red" : "green"
                }
            />
            <Card
                title="Active Students"
                value={formatValue(kpis.activeStudents.value)}
                sub={kpis.activeStudents.subtext}
                icon={Users}
                badge={kpis.activeStudents.changePercent}
                badgeTone={
                    kpis.activeStudents.changeDirection === "down" ? "red" : "green"
                }
            />
            <Card
                title="Course Completions"
                value={formatValue(kpis.courseCompletions.value)}
                sub={kpis.courseCompletions.subtext}
                icon={GraduationCap}
                badge={kpis.courseCompletions.changePercent}
                badgeTone={
                    kpis.courseCompletions.changeDirection === "down" ? "red" : "green"
                }
            />
            <Card
                title="Product Sales"
                value={formatValue(kpis.productSales.value)}
                sub={kpis.productSales.subtext}
                icon={ShoppingBag}
                badge={kpis.productSales.changePercent}
                badgeTone={
                    kpis.productSales.changeDirection === "down" ? "red" : "green"
                }
            />
        </div>
    );
}