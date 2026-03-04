import { SquareChartGantt, Truck, ShoppingBag, TrendingUp, Banknote } from "lucide-react";

function StatCard({
    title,
    value,
    subtitle,
    icon,
    accent = "cyan",
    chip,
    showDots = false,
}: {
    title: string;
    value: string;
    subtitle?: string;
    icon: React.ReactNode;
    accent?: "cyan" | "indigo" | "orange" | "purple";
    chip?: string;
    showDots?: boolean;
}) {
    const accentGlow: Record<string, string> = {
        cyan: "bg-cyan-100/60",
        indigo: "bg-indigo-100/60",
        orange: "bg-orange-100/70",
        purple: "bg-purple-100/60",
    };

    const accentDots: Record<string, string> = {
        cyan: "bg-cyan-400",
        indigo: "bg-indigo-400",
        orange: "bg-orange-400",
        purple: "bg-purple-400",
    };

    return (
        <div
            className={[
                "relative overflow-hidden rounded-3xl p-6 shadow-[0_8px_24px_rgba(15,23,42,0.06)] ring-1",
                accent === "cyan" &&
                "bg-gradient-to-br from-cyan-50 via-slate-50 to-cyan-100/30 ring-cyan-100",
                accent === "indigo" &&
                "bg-gradient-to-br from-indigo-50 via-slate-50 to-indigo-100/30 ring-indigo-100",
                accent === "orange" &&
                "bg-gradient-to-br from-orange-50 via-slate-50 to-orange-100/30 ring-orange-100",
                accent === "purple" &&
                "bg-gradient-to-br from-purple-50 via-slate-50 to-purple-100/30 ring-purple-100",
            ].join(" ")}
        >
            {/* background wash (keeps accent tint) */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-transparent" />

            <div
                className={[
                    "pointer-events-none absolute inset-0 opacity-70",
                    accent === "cyan" &&
                    "bg-[radial-gradient(circle_at_55%_45%,rgba(34,195,238,0.18),transparent_60%)]",
                    accent === "indigo" &&
                    "bg-[radial-gradient(circle_at_55%_45%,rgba(99,102,241,0.16),transparent_60%)]",
                    accent === "orange" &&
                    "bg-[radial-gradient(circle_at_55%_45%,rgba(249,115,22,0.16),transparent_60%)]",
                    accent === "purple" &&
                    "bg-[radial-gradient(circle_at_55%_45%,rgba(168,85,247,0.16),transparent_60%)]",
                ].join(" ")}
            />

            {/* 🔥 icon glow */}
            <div
                className={[
                    "absolute left-6 top-6 h-16 w-16 rounded-full blur-xl",
                    accentGlow[accent],
                ].join(" ")}
            />

            {/* 🔥 right dots indicator */}
            {showDots ? (
                <div className="absolute right-5 top-5 flex items-center gap-1">
                    <span className={["h-2 w-2 rounded-full", accentDots[accent]].join(" ")} />
                    <span className="h-2 w-2 rounded-full bg-orange-200" />
                </div>
            ) : null}

            {/* content */}
            <div className="relative z-10 flex items-start justify-between">
                <div className="relative grid h-12 w-12 place-items-center rounded-full">
                    {/* soft glow circle */}
                    <span
                        className={[
                            "absolute inset-0 rounded-full blur-md",
                            accentGlow[accent],
                        ].join(" ")}
                    />
                    {/* icon */}
                    <span className="relative z-10">{icon}</span>
                </div>

                {chip ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-cyan-200/70 px-3 py-1 text-[12px] font-semibold text-cyan-800">
                        <TrendingUp size={14} className="text-cyan-700" strokeWidth={2.5} />
                        {chip}
                    </span>
                ) : null}
            </div>

            <div className="relative z-10 mt-6">
                <p className="text-xs font-semibold tracking-wide text-slate-500">
                    {title.toUpperCase()}
                </p>
                <p className="mt-1 text-3xl font-bold text-slate-900">{value}</p>
                {subtitle ? (
                    <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
                ) : null}
            </div>
        </div>
    );
}

export default function OrderStats() {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <StatCard
                title="This month revenue"
                value="$42,500"
                chip="+12%"
                accent="cyan"
                icon={<Banknote size={18} className="text-cyan-600" />}
            />
            <StatCard
                title="Total orders"
                value="156"
                accent="indigo"
                icon={<ShoppingBag size={18} className="text-indigo-600" />}
            />
            <StatCard
                title="To be shipped"
                value="8"
                accent="orange"
                showDots
                icon={<Truck size={20} className="text-orange-600" strokeWidth={2.5} />}
            />
            <StatCard
                title="Avg order value"
                value="$275"
                accent="purple"
                icon={<SquareChartGantt size={20} className="text-purple-600" strokeWidth={2.5} />}
            />
        </div>
    );
}