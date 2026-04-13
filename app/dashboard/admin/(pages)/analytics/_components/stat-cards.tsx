import React from "react";
import { DollarSign, TrendingUp } from "lucide-react";
import type {
    AdminAnalyticsSummaryResponse,
} from "@/types/admin/analytics.types";

function StatCard({
    title,
    value,
    sub,
    footLeft,
    footRight,
    icon: Icon,
    iconTone,
}: {
    title: string;
    value: string;
    sub: string;
    footLeft: string; // e.g. "+15%"
    footRight: string; // e.g. "vs last month"
    icon: React.ElementType;
    iconTone: "cyan" | "indigo" | "blue" | "purple";
}) {
    const tone =
        iconTone === "cyan"
            ? "bg-cyan-50 text-cyan-600 ring-cyan-100"
            : iconTone === "indigo"
                ? "bg-indigo-50 text-indigo-600 ring-indigo-100"
                : iconTone === "purple"
                    ? "bg-violet-50 text-violet-600 ring-violet-100"
                    : "bg-sky-50 text-sky-600 ring-sky-100";

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            {/* top: title + icon square */}
            <div className="flex items-start justify-between gap-3">
                <p className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
                    {title}
                </p>

                {/* ✅ keep same icon, only style like 1st picture */}
                <div
                    className={[
                        "grid h-7 w-7 place-items-center rounded-md ring-1",
                        tone,
                    ].join(" ")}
                >
                    <Icon size={14} />
                </div>
            </div>

            {/* value */}
            <div className="mt-3">
                <p className="text-xl font-semibold text-slate-900">{value}</p>
                <p className="mt-1 text-xs text-slate-500">{sub}</p>
            </div>

            {/* footer line */}
            <div className="mt-3 flex items-center gap-2 text-xs">
                <span className="font-semibold text-[var(--primary)]">{footLeft}</span>
                <span className="text-slate-500">{footRight}</span>
            </div>
        </div>
    );
}

function formatCurrency(n: number) {
    return `$${Math.round(n).toLocaleString()}`;
}

function formatPercent(n: number) {
    const withSign = n > 0 ? `+${n}` : `${n}`;
    return `${withSign}%`;
}

export default function StatCards({
    summary,
}: {
    summary: AdminAnalyticsSummaryResponse;
}) {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <StatCard
                title="Total Revenue"
                value={formatCurrency(summary.totalRevenue.value)}
                sub="Revenue in selected period"
                footLeft={formatPercent(summary.totalRevenue.growthRatePercent)}
                footRight="growth rate"
                icon={DollarSign}
                iconTone="cyan"
            />
            <StatCard
                title="Total Students"
                value={summary.totalStudents.value.toLocaleString()}
                sub="Students in selected period"
                footLeft={formatPercent(summary.totalStudents.growthRatePercent)}
                footRight="growth rate"
                icon={TrendingUp}
                iconTone="indigo"
            />
        </div>
    );
}