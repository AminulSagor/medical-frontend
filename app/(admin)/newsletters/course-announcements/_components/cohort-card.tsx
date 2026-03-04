"use client";

import { Calendar } from "lucide-react";
import type { CourseCohortCard } from "../types/course-annoucements-types";
import { cx } from "@/utils/course-admin-ui";

function AccentStrip({ tone }: { tone?: CourseCohortCard["accentTone"] }) {
    const t = tone ?? "teal";
    const cls =
        t === "indigo"
            ? "bg-indigo-500"
            : t === "danger"
                ? "bg-rose-500"
                : t === "neutral"
                    ? "bg-slate-300"
                    : "bg-teal-500";

    return <div className={cx("h-[3px] w-full", cls)} />;
}

function StatusBadge({ status }: { status: CourseCohortCard["status"] }) {
    const map = {
        upcoming: "bg-teal-50 text-teal-700 ring-1 ring-teal-200/70",
        completed: "bg-slate-50 text-slate-600 ring-1 ring-slate-200/70",
        cancelled: "bg-rose-50 text-rose-700 ring-1 ring-rose-200/70",
    }[status];

    const label =
        status === "upcoming" ? "UPCOMING" : status === "completed" ? "COMPLETED" : "CANCELLED";

    return (
        <span
            className={cx(
                "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-semibold tracking-wide",
                map
            )}
        >
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-white ring-1 ring-black/5">
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
            </span>
            {label}
        </span>
    );
}

function SecondaryBadge({
    badge,
}: {
    badge?: CourseCohortCard["secondaryBadge"];
}) {
    if (!badge) return null;

    const tone = badge.tone ?? "danger";
    const cls =
        tone === "danger"
            ? "bg-rose-50 text-rose-700 ring-1 ring-rose-200/70"
            : tone === "warning"
                ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200/70"
                : "bg-slate-50 text-slate-600 ring-1 ring-slate-200/70";

    return (
        <span className={cx("rounded-lg px-3 py-1.5 text-[11px] font-semibold", cls)}>
            {badge.label}
        </span>
    );
}

function ComposeButton({
    label,
    tone,
}: {
    label: string;
    tone?: CourseCohortCard["cta"]["tone"];
}) {
    const t = tone ?? "primary";
    const cls =
        t === "danger"
            ? "bg-rose-500 hover:bg-rose-600"
            : t === "indigo"
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-teal-500 hover:bg-teal-600";

    return (
        <button
            type="button"
            className={cx(
                "mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl px-4",
                "text-xs font-semibold text-white shadow-sm",
                "transition active:scale-[0.99]",
                cls
            )}
        >
            <span className="grid h-6 w-6 place-items-center rounded-lg bg-white/10">
                <span className="h-0 w-0 border-y-[5px] border-y-transparent border-l-[8px] border-l-white" />
            </span>
            {label}
        </button>
    );
}

export default function CohortCard({ item }: { item: CourseCohortCard }) {
    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <AccentStrip tone={item.accentTone} />

            <div className="p-5">
                {/* top row */}
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <h3 className="text-sm font-semibold leading-snug text-slate-900">
                            {item.title}
                        </h3>

                        {item.dateLabel ? (
                            <div className="mt-2 inline-flex items-center gap-2 text-xs font-medium text-slate-400">
                                <Calendar size={14} className="text-slate-400" />
                                {item.dateLabel}
                            </div>
                        ) : null}
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-2">
                        <StatusBadge status={item.status} />
                        <SecondaryBadge badge={item.secondaryBadge} />
                    </div>
                </div>

                {/* metric */}
                <div className="py-12 text-center">
                    <p className="text-[60px] font-black leading-[60px] tracking-[-3px] text-slate-900">
                        {item.metric.value}
                    </p>
                    <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-300">
                        {item.metric.label}
                    </p>
                </div>

                <ComposeButton label={item.cta.label} tone={item.cta.tone} />
            </div>
        </div>
    );
}