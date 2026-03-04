"use client";

import { Filter, Upload } from "lucide-react";
import { useState } from "react";

type Row = {
    id: string;
    status: "Sent";
    type: "Class Update" | "Marketing";
    subject: string;
    audience: string;
    openRate: number; // %
    sentDate: string;
};

const ROWS: Row[] = [
    { id: "r1", status: "Sent", type: "Class Update", subject: "Important: March 12th Airway Workshop Location Change...", audience: "Target cohorts", openRate: 98, sentDate: "Oct 25, 2026" },
    { id: "r2", status: "Sent", type: "Marketing", subject: "New Research: Pediatric Airway Management", audience: "All Subscribers", openRate: 45, sentDate: "Oct 24, 2026" },
    { id: "r3", status: "Sent", type: "Class Update", subject: "Updated Schedule: Emergency Airway Bootcamp", audience: "Target cohorts", openRate: 88, sentDate: "Oct 22, 2026" },
    { id: "r4", status: "Sent", type: "Marketing", subject: "Clinical Tips: Difficult Airway Management", audience: "All Subscribers", openRate: 67, sentDate: "Oct 20, 2026" },
    { id: "r5", status: "Sent", type: "Class Update", subject: "Faculty Announcement: New Pediatric Specialist", audience: "Target cohorts", openRate: 72, sentDate: "Oct 18, 2026" },
    { id: "r6", status: "Sent", type: "Marketing", subject: "Limited Seats: Advanced Airway Workshop", audience: "All Subscribers", openRate: 55, sentDate: "Oct 16, 2026" },
    { id: "r7", status: "Sent", type: "Class Update", subject: "Workshop Materials Now Available", audience: "Target cohorts", openRate: 91, sentDate: "Oct 14, 2026" },
    { id: "r8", status: "Sent", type: "Marketing", subject: "New Article: Video Laryngoscopy Guide", audience: "All Subscribers", openRate: 39, sentDate: "Oct 12, 2026" },
    { id: "r9", status: "Sent", type: "Class Update", subject: "Simulation Lab Update for October", audience: "Target cohorts", openRate: 83, sentDate: "Oct 10, 2026" },
    { id: "r10", status: "Sent", type: "Marketing", subject: "Case Study: Airway Complication Review", audience: "All Subscribers", openRate: 61, sentDate: "Oct 8, 2026" },
    { id: "r11", status: "Sent", type: "Class Update", subject: "New Faculty Added to Airway Institute", audience: "Target cohorts", openRate: 87, sentDate: "Oct 7, 2026" },
    { id: "r12", status: "Sent", type: "Marketing", subject: "Top 5 Airway Tools Every Clinician Should Know", audience: "All Subscribers", openRate: 64, sentDate: "Oct 6, 2026" },
    { id: "r13", status: "Sent", type: "Class Update", subject: "Airway Skills Workshop Agenda Update", audience: "Target cohorts", openRate: 79, sentDate: "Oct 5, 2026" },
    { id: "r14", status: "Sent", type: "Marketing", subject: "Clinical Research Update: Pediatric Airway", audience: "All Subscribers", openRate: 52, sentDate: "Oct 4, 2026" },
    { id: "r15", status: "Sent", type: "Class Update", subject: "New Simulation Cases Available", audience: "Target cohorts", openRate: 93, sentDate: "Oct 3, 2026" },
    { id: "r16", status: "Sent", type: "Marketing", subject: "Newsletter Special: Difficult Airway Strategies", audience: "All Subscribers", openRate: 48, sentDate: "Oct 2, 2026" },
    { id: "r17", status: "Sent", type: "Class Update", subject: "Workshop Reminder: Airway Bootcamp Tomorrow", audience: "Target cohorts", openRate: 95, sentDate: "Oct 1, 2026" },
    { id: "r18", status: "Sent", type: "Marketing", subject: "Latest Publication: Emergency Airway Management", audience: "All Subscribers", openRate: 58, sentDate: "Sep 30, 2026" },
    { id: "r19", status: "Sent", type: "Class Update", subject: "Course Enrollment Update for Fall Session", audience: "Target cohorts", openRate: 81, sentDate: "Sep 28, 2026" },
    { id: "r20", status: "Sent", type: "Marketing", subject: "Airway Institute Monthly Highlights", audience: "All Subscribers", openRate: 63, sentDate: "Sep 27, 2026" },
];

function Progress({ value }: { value: number }) {
    const v = Math.max(0, Math.min(100, value));
    return (
        <div className="flex items-center gap-3">
            <div className="h-2 w-[120px] rounded-full bg-slate-100">
                <div
                    className="h-2 rounded-full bg-[var(--primary)]"
                    style={{ width: `${v}%` }}
                />
            </div>
            <span className="text-xs font-semibold text-slate-700">{v}%</span>
        </div>
    );
}

export default function TransmissionTable() {
    const PAGE_SIZE = 5;
    const [page, setPage] = useState(1);
    const total = ROWS.length;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const startIndex = (page - 1) * PAGE_SIZE;
    const endIndexExclusive = Math.min(startIndex + PAGE_SIZE, total);
    const pageRows = ROWS.slice(startIndex, endIndexExclusive);
    const showingFrom = total === 0 ? 0 : startIndex + 1;
    const showingTo = endIndexExclusive;

    return (
        <div className="mt-7">
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <div className="grid h-7 w-7 place-items-center rounded-lg bg-[var(--primary-50)] text-[var(--primary)]">
                        <span className="text-xs">↻</span>
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900">
                        Recent Transmission History
                    </h3>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                    >
                        <Filter size={14} /> Filter
                    </button>
                    <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                    >
                        <Upload size={14} /> Export
                    </button>
                </div>
            </div>

            <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full">
                    <thead className="bg-slate-50">
                        <tr className="text-left text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                            <th className="px-5 py-3">Status / Type</th>
                            <th className="px-5 py-3">Subject</th>
                            <th className="px-5 py-3">Audience</th>
                            <th className="px-5 py-3">Open Rate</th>
                            <th className="px-5 py-3">Sent Date</th>
                            <th className="px-5 py-3 text-right">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {pageRows.map((r, idx) => (
                            <tr
                                key={r.id}
                                className={[
                                    "border-t border-slate-100",
                                    idx === 0 ? "bg-white" : "bg-white",
                                ].join(" ")}
                            >
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                        <div>
                                            <p className="text-xs font-semibold text-slate-900">
                                                {r.status}
                                            </p>
                                            <span className="mt-1 inline-flex rounded-full bg-[var(--primary-50)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--primary)]">
                                                {r.type}
                                            </span>
                                        </div>
                                    </div>
                                </td>

                                <td className="px-5 py-4">
                                    <p className="max-w-[420px] truncate text-xs font-semibold text-slate-900">
                                        {r.subject}
                                    </p>
                                </td>

                                <td className="px-5 py-4">
                                    <p className="text-xs text-slate-600">{r.audience}</p>
                                </td>

                                <td className="px-5 py-4">
                                    <Progress value={r.openRate} />
                                </td>

                                <td className="px-5 py-4">
                                    <p className="text-xs text-slate-600">{r.sentDate}</p>
                                </td>

                                <td className="px-5 py-4 text-right">
                                    <button
                                        type="button"
                                        className="text-xs font-semibold text-[var(--primary)] hover:underline"
                                    >
                                        View Report
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="flex items-center justify-between gap-3 px-5 py-4">
                    <p className="text-xs text-slate-500">
                        Showing {showingFrom} to {showingTo} of {total} results
                    </p>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            disabled={page <= 1}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            className={[
                                "rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold",
                                page <= 1
                                    ? "cursor-not-allowed opacity-50"
                                    : "text-slate-600 hover:bg-slate-50",
                            ].join(" ")}
                        >
                            Previous
                        </button>

                        <button
                            type="button"
                            disabled={page >= totalPages}
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            className={[
                                "rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold",
                                page >= totalPages
                                    ? "cursor-not-allowed opacity-50"
                                    : "text-slate-900 hover:bg-slate-50",
                            ].join(" ")}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex justify-center">
                <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-xl border border-[var(--primary)] bg-white px-5 py-2 text-xs font-semibold text-[var(--primary)] hover:bg-[var(--primary-50)]"
                >
                    View All Transmission History <span className="ml-2">→</span>
                </button>
            </div>
        </div>
    );
}