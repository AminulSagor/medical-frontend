"use client";

import type { CourseTabKey } from "./courses.types";

function Tab({
    active,
    label,
    count,
    onClick,
    rightAdornment,
}: {
    active: boolean;
    label: string;
    count?: number;
    onClick: () => void;
    rightAdornment?: React.ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                "relative inline-flex items-center gap-2 px-1 pb-3 pt-2 transition",
                active ? "text-slate-700" : "text-slate-500 hover:text-slate-700",
            ].join(" ")}
        >
            <span className="text-sm font-semibold">{label}</span>

            {rightAdornment ? (
                rightAdornment
            ) : typeof count === "number" ? (
                <span
                    className={[
                        "mt-[-2px] inline-flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-[16px] font-semibold",
                        active
                            ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                            : "bg-slate-100 text-slate-500",
                    ].join(" ")}
                >
                    {count}
                </span>
            ) : null}

            <span
                className={[
                    "absolute left-0 right-0 -bottom-[1px] h-0.5 rounded-full transition",
                    active ? "bg-[var(--primary)]" : "bg-transparent",
                ].join(" ")}
            />
        </button>
    );
}

export default function CoursesTabs({
    tab,
    onChange,
    counts,
}: {
    tab: CourseTabKey;
    onChange: (t: CourseTabKey) => void;
    counts: Record<CourseTabKey, number>;
}) {
    return (
        <div className="border-b border-slate-200">
            <div className="flex flex-wrap items-center gap-6">
                <Tab
                    active={tab === "upcoming"}
                    label="Upcoming"
                    count={counts.upcoming}
                    onClick={() => onChange("upcoming")}
                />
                <Tab
                    active={tab === "past"}
                    label="Past"
                    count={counts.past}
                    onClick={() => onChange("past")}
                />
                <Tab
                    active={tab === "drafts"}
                    label="Drafts"
                    count={counts.drafts}
                    onClick={() => onChange("drafts")}
                />
                <Tab
                    active={tab === "refund_requests"}
                    label="Refund Requests"
                    onClick={() => onChange("refund_requests")}
                    rightAdornment={
                        <span
                            className={[
                                "mt-[-2px] inline-flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-[16px] font-semibold",
                                counts.refund_requests > 0
                                    ? "bg-orange-100 text-orange-600"
                                    : "bg-slate-100 text-slate-400",
                            ].join(" ")}
                        >
                            {counts.refund_requests}
                        </span>
                    }
                />
            </div>
        </div>
    );
}