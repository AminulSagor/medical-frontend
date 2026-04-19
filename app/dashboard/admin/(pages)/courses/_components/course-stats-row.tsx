"use client";

import { CalendarDays, Users, Repeat } from "lucide-react";

function StatCard({
    label,
    value,
    inlineMeta,
    pillText,
    icon,
}: {
    label: string;
    value: string;
    inlineMeta?: string;
    pillText?: string;
    icon: React.ReactNode;
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-[11px] font-semibold tracking-wide text-slate-500">
                        {label}
                    </p>

                    <div className="mt-1 flex flex-wrap items-center gap-3">
                        <div className="flex items-end gap-2">
                            <p className="text-xl font-semibold leading-none text-slate-900">
                                {value}
                            </p>

                            {inlineMeta ? (
                                <span
                                    className={[
                                        "text-xs font-semibold",
                                        label === "REFUND REQUESTS" ? "text-orange-500" : "text-slate-500",
                                    ].join(" ")}
                                >
                                    {inlineMeta}
                                </span>
                            ) : null}
                        </div>

                        {pillText ? (
                            <span className="rounded-full bg-[var(--primary)]/10 px-3 py-1 text-[11px] font-semibold text-[var(--primary)]">
                                {pillText}
                            </span>
                        ) : null}
                    </div>
                </div>

                <div
                    className={[
                        "grid h-10 w-10 place-items-center rounded-xl ring-1",
                        label === "REFUND REQUESTS"
                            ? "bg-rose-50 text-rose-500 ring-rose-100"
                            : "bg-[var(--primary-50)] text-[var(--primary)] ring-sky-100",
                    ].join(" ")}
                >
                    {icon}
                </div>
            </div>
        </div>
    );
}

export default function CourseStatsRow({
    nextWorkshopValue,
    nextWorkshopDate,
    openSeats,
    filledSeats,
    refundRequests,
}: {
    nextWorkshopValue: string;
    nextWorkshopDate: string;
    openSeats: number;
    filledSeats: number;
    refundRequests: number;
}) {
    return (
        <div className="grid gap-3 md:grid-cols-3">
            <StatCard
                label="NEXT WORKSHOP"
                value={nextWorkshopValue}
                inlineMeta={nextWorkshopDate}
                icon={<CalendarDays size={18} />}
            />

            <StatCard
                label="TOTAL ACTIVE SEATS"
                value={String(openSeats)}
                inlineMeta="Open"
                pillText={`${filledSeats} Filled`}
                icon={<Users size={18} />}
            />

            <StatCard
                label="REFUND REQUESTS"
                value={String(refundRequests)}
                inlineMeta="Pending Review"
                icon={<Repeat size={18} />}
            />
        </div>
    );
}
