import React from "react";
import { DollarSign, TrendingUp, Users, BarChart3 } from "lucide-react";

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

export default function StatCards() {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <StatCard
                title="Total Revenue"
                value="$124,500"
                sub="($80k Courses / $44k Store)"
                footLeft="+15%"
                footRight="vs last month"
                icon={DollarSign}
                iconTone="cyan"
            />
            <StatCard
                title="Net Profit"
                value="$85,200"
                sub="68.4% Profit Margin"
                footLeft="+8%"
                footRight="vs last month"
                icon={TrendingUp}
                iconTone="indigo"
            />
            <StatCard
                title="Conversion Rate"
                value="3.2%"
                sub="Average across all channels"
                footLeft="+1.2%"
                footRight="improvement"
                icon={BarChart3}
                iconTone="blue"
            />
            <StatCard
                title="Total Students"
                value="145"
                sub="Newly enrolled this month"
                footLeft="+5%"
                footRight="cohort growth"
                icon={Users}
                iconTone="purple"
            />
        </div>
    );
}