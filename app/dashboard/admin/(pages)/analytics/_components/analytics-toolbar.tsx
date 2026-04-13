"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Download } from "lucide-react";

export type AnalyticsRangeKey = "last_7" | "last_30" | "this_year";

const ranges: Array<{ key: AnalyticsRangeKey; label: string }> = [
    { key: "last_7", label: "Last 7 Days" },
    { key: "last_30", label: "Last 30 Days" },
    { key: "this_year", label: "This Year" },
];

export default function AnalyticsToolbar() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const active = (searchParams.get("range") as AnalyticsRangeKey) ?? "last_30";

    function updateRange(next: AnalyticsRangeKey) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("range", next);
        router.replace(`${pathname}?${params.toString()}`);
    }

    const activeLabel = useMemo(
        () => ranges.find((r) => r.key === active)?.label ?? "Last 30 Days",
        [active]
    );

    return (
        <div className="flex flex-wrap items-center gap-3">
            {/* Range pills */}
            <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-white p-1">
                {ranges.map((r) => {
                    const isActive = r.key === active;
                    return (
                        <button
                            key={r.key}
                            type="button"
                            onClick={() => updateRange(r.key)}
                            className={[
                                "rounded-md px-3 py-2 text-xs font-semibold transition",
                                isActive
                                    ? "bg-slate-900 text-white"
                                    : "text-slate-600 hover:bg-slate-100",
                            ].join(" ")}
                            aria-pressed={isActive}
                        >
                            {r.label}
                        </button>
                    );
                })}
            </div>

            {/* Download */}
            <button
                type="button"
                className="inline-flex items-center gap-2 rounded-md bg-[var(--primary)] px-4 py-2 text-xs font-semibold text-white hover:bg-[var(--primary-hover)] transition"
                title={`Download report (${activeLabel})`}
            >
                <Download size={16} />
                Download Report PDF
            </button>
        </div>
    );
}