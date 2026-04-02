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
    value: string;        // big text
    inlineMeta?: string;  // small text beside big (used for date or "Open")
    pillText?: string;    // pill badge text (used for "120 Filled")
    icon: React.ReactNode;
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-[11px] font-semibold tracking-wide text-slate-500">
                        {label}
                    </p>

                    {/* value row */}
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

                {/* icon unchanged */}
                <div
                    className={[
                        "grid h-10 w-10 place-items-center rounded-xl ring-1",
                        label === "REFUND REQUESTS"
                            ? "bg-rose-50 text-rose-500 ring-rose-100"   // ✅ red tone
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
    nextWorkshop,
    activeSeatsLabel,
    openSeatsLabel,
    refundPendingLabel,
}: {
    nextWorkshop: string;
    activeSeatsLabel: string;
    openSeatsLabel: string;
    refundPendingLabel: string;
}) {
    // split like "153 Total", "45 Open", "7 Pending"
    const [activeMain, ...activeRest] = activeSeatsLabel.split(" ");
    const activeTag = activeRest.join(" ");

    const [refundMain, ...refundRest] = refundPendingLabel.split(" ");
    const refundTag = refundRest.join(" ");

    return (
        <div className="grid gap-3 md:grid-cols-3">
            <StatCard
                label="NEXT WORKSHOP"
                value="In 5 Days"
                inlineMeta={nextWorkshop}   // ✅ inline date (matches pic-1)
                icon={<CalendarDays size={18} />}
            />

            <StatCard
                label="TOTAL ACTIVE SEATS"
                value="45"
                inlineMeta="Open"
                pillText="120 Filled"
                icon={<Users size={18} />}
            />

            <StatCard
                label="REFUND REQUESTS"
                value={refundPendingLabel.split(" ")[0]}          // "2" or "7"
                inlineMeta="Pending Review"                      // ✅ orange text
                icon={<Repeat size={18} />}
            />
        </div>
    );
}