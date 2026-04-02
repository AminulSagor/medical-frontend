import React from "react";
import { Package, DollarSign, ShoppingCart, AlertTriangle, TrendingUp } from "lucide-react";

function splitHint(hint: string) {
    // expects like: "▲ +12% vs. last month"
    // returns { delta:"+12%", rest:"vs. last month" } (best-effort)
    const cleaned = hint.replace("▲", "").trim();
    const m = cleaned.match(/^([+\-]?\d+%)(.*)$/);
    if (!m) return { delta: null as string | null, rest: hint };
    return { delta: m[1].trim(), rest: (m[2] || "").trim() };
}

function StatCard({
    label,
    value,
    hint,
    Icon,
    tone = "primary",
}: {
    label: string;
    value: string;
    hint: string;
    Icon: React.ElementType;
    tone?: "primary" | "red" | "orange";
}) {
    const toneMap: Record<typeof tone, string> = {
        primary:
            "bg-[var(--primary-50)] ring-[var(--primary)]/15 text-[var(--primary)]",
        red: "bg-red-50 ring-red-100 text-red-600",
        orange: "bg-orange-50 ring-orange-100 text-orange-700",
    };

    const { delta, rest } = splitHint(hint);

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        {label}
                    </p>

                    <p
                        className={[
                            "mt-1 text-2xl font-extrabold",
                            tone === "red"
                                ? "text-red-600"
                                : tone === "orange"
                                    ? "text-orange-600"
                                    : "text-slate-900",
                        ].join(" ")}
                    >
                        {value}
                    </p>

                    <div className="mt-3 flex items-center gap-2 text-xs">
                        {delta ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--primary)]/10 px-2 py-1 font-semibold text-[var(--primary)] ring-1 ring-[var(--primary)]/15">
                                <TrendingUp size={14} />
                                {delta}
                            </span>
                        ) : null}

                        <span
                            className={
                                tone === "red"
                                    ? "text-red-600"
                                    : "text-slate-500"
                            }
                        >
                            {delta ? rest : hint}
                        </span>
                    </div>
                </div>

                <div
                    className={[
                        "grid h-10 w-10 shrink-0 place-items-center rounded-xl ring-1",
                        toneMap[tone],
                    ].join(" ")}
                >
                    <Icon size={18} />
                </div>
            </div>
        </div>
    );
}

export default function ProductStatCards() {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
                label="Total Products"
                value="1,234"
                hint="▲ +12% vs. last month"
                Icon={Package}
                tone="primary"
            />
            <StatCard
                label="Inventory Value"
                value="$84,200"
                hint="Total valuation"
                Icon={DollarSign}
                tone="primary"
            />
            <StatCard
                label="Out of Stock"
                value="12"
                hint="Action required"
                Icon={ShoppingCart}
                tone="red"
            />
            <StatCard
                label="Low Stock Alerts"
                value="28"
                hint="Restock recommended"
                Icon={AlertTriangle}
                tone="orange"
            />
        </div>
    );
}