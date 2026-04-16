"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import {
    ChevronDown,
    ChevronUp,
    Download,
    Loader2,
    Mail,
    Phone,
    Search,
    Users,
    X,
} from "lucide-react";

import { getWorkshopEnrollees } from "@/service/admin/workshop.service";
import type {
    WorkshopEnrolleeItem,
    WorkshopEnrolleesResponse,
} from "@/types/admin/workshop.types";

function StatusBadge({ status }: { status: string }) {
    const normalized = status.toLowerCase();

    let className =
        "inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold";

    if (normalized.includes("book")) {
        className += " bg-emerald-100 text-emerald-700";
    } else if (normalized.includes("refund requested")) {
        className += " bg-amber-100 text-amber-700";
    } else if (normalized.includes("partial")) {
        className += " bg-orange-100 text-orange-700";
    } else if (normalized.includes("refund")) {
        className += " bg-slate-200 text-slate-700";
    } else {
        className += " bg-slate-100 text-slate-600";
    }

    return <span className={className}>{status}</span>;
}

function MetricCard({
    label,
    value,
}: {
    label: string;
    value: number;
}) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                {label}
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
        </div>
    );
}

export default function EnrolleeListModal({
    open,
    workshopId,
    onClose,
    onProcessRefund,
}: {
    open: boolean;
    workshopId: string;
    onClose: () => void;
    onProcessRefund: (reservationId: string) => void;
}) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [response, setResponse] = useState<WorkshopEnrolleesResponse | null>(
        null,
    );
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (!open) return;

        setLoading(true);
        setError(null);

        getWorkshopEnrollees(workshopId, { page, limit: 10 })
            .then((res) => {
                setResponse(res);
            })
            .catch((err) => {
                setError(
                    err instanceof Error ? err.message : "Failed to load enrollees.",
                );
            })
            .finally(() => {
                setLoading(false);
            });
    }, [open, workshopId, page]);

    const filteredItems = useMemo(() => {
        const items = response?.data.items ?? [];
        const query = search.trim().toLowerCase();

        return items.filter((item) => {
            const matchesSearch =
                !query ||
                item.studentInfo.fullName.toLowerCase().includes(query) ||
                item.studentInfo.email.toLowerCase().includes(query) ||
                item.institutionOrHospital.toLowerCase().includes(query);

            const matchesStatus =
                statusFilter === "all" ||
                item.status.toLowerCase() === statusFilter.toLowerCase();

            return matchesSearch && matchesStatus;
        });
    }, [response, search, statusFilter]);

    if (!open) return null;

    const workshopTitle = response?.data.workshop.title ?? "Course Enrollee List";
    const overview = response?.data.overview;
    const totalPages = response?.meta.totalPages ?? 1;

    function downloadRosterCsv() {
        const rows: string[] = [
            [
                "Student Name",
                "Email",
                "Phone",
                "Booking Type",
                "Group Size",
                "Institution/Hospital",
                "Registered At",
                "Payment Amount",
                "Status",
            ].join(","),
        ];

        for (const item of response?.data.items ?? []) {
            rows.push(
                [
                    `"${item.studentInfo.fullName}"`,
                    `"${item.studentInfo.email}"`,
                    `"${item.studentInfo.phoneNumber}"`,
                    `"${item.bookingType}"`,
                    item.groupSize,
                    `"${item.institutionOrHospital}"`,
                    `"${item.registeredAt}"`,
                    `"${item.paymentAmount}"`,
                    `"${item.status}"`,
                ].join(","),
            );
        }

        const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = "workshop-enrollees.csv";
        anchor.click();
        URL.revokeObjectURL(url);
    }

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
            <div className="max-h-[92vh] w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-2xl">
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">
                            Course Enrollee List
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">{workshopTitle}</p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="space-y-5 overflow-y-auto px-6 py-5">
                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 size={24} className="animate-spin text-slate-400" />
                        </div>
                    ) : error ? (
                        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                            {error}
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                                <MetricCard
                                    label="Total Enrolled"
                                    value={overview?.totalEnrolled ?? 0}
                                />
                                <MetricCard
                                    label="Refund Req."
                                    value={overview?.refundRequested ?? 0}
                                />
                                <MetricCard
                                    label="Partial Refund"
                                    value={overview?.partialRefund ?? 0}
                                />
                                <MetricCard
                                    label="Refunded"
                                    value={overview?.refunded ?? 0}
                                />
                            </div>

                            <div className="flex flex-col gap-3 lg:flex-row">
                                <div className="relative flex-1">
                                    <Search
                                        size={16}
                                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                    />
                                    <input
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search by name, email or institution..."
                                        className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-[var(--primary)]"
                                    />
                                </div>

                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-[var(--primary)]"
                                >
                                    <option value="all">Enrollment Status</option>
                                    <option value="booked">Booked</option>
                                    <option value="refund requested">Refund Requested</option>
                                    <option value="partial refunded">Partial Refunded</option>
                                    <option value="refunded">Refunded</option>
                                </select>
                            </div>

                            <div className="overflow-hidden rounded-xl border border-slate-200">
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[980px]">
                                        <thead className="bg-slate-50">
                                            <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                                <th className="px-4 py-3">Student Info</th>
                                                <th className="px-4 py-3">Booking Type</th>
                                                <th className="px-4 py-3">Institution/Hospital</th>
                                                <th className="px-4 py-3">Reg. Date</th>
                                                <th className="px-4 py-3">Payment</th>
                                                <th className="px-4 py-3">Status</th>
                                                <th className="px-4 py-3 text-right">Action</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {filteredItems.length === 0 ? (
                                                <tr>
                                                    <td
                                                        colSpan={7}
                                                        className="px-4 py-10 text-center text-sm text-slate-500"
                                                    >
                                                        No enrollees found.
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredItems.map((item) => {
                                                    const isExpanded = Boolean(expandedRows[item.reservationId]);
                                                    const canExpand =
                                                        item.members.length > 0 || item.groupSize > 1;

                                                    return (
                                                        <Fragment key={item.reservationId}>
                                                            <tr
                                                                className="border-t border-slate-100 text-sm"
                                                            >
                                                                <td className="px-4 py-4">
                                                                    <div className="flex items-start gap-3">
                                                                        {canExpand ? (
                                                                            <button
                                                                                type="button"
                                                                                onClick={() =>
                                                                                    setExpandedRows((prev) => ({
                                                                                        ...prev,
                                                                                        [item.reservationId]: !prev[item.reservationId],
                                                                                    }))
                                                                                }
                                                                                className="mt-1 rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                                                                            >
                                                                                {isExpanded ? (
                                                                                    <ChevronUp size={16} />
                                                                                ) : (
                                                                                    <ChevronDown size={16} />
                                                                                )}
                                                                            </button>
                                                                        ) : (
                                                                            <div className="w-6" />
                                                                        )}

                                                                        <div className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                                                                            {item.studentInfo.fullName.charAt(0)}
                                                                        </div>

                                                                        <div>
                                                                            <p className="font-semibold text-slate-900">
                                                                                {item.studentInfo.fullName}
                                                                            </p>
                                                                            <p className="text-xs text-slate-500">
                                                                                {item.studentInfo.email}
                                                                            </p>
                                                                            <p className="text-xs text-slate-400">
                                                                                {item.studentInfo.phoneNumber}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </td>

                                                                <td className="px-4 py-4">
                                                                    <div className="space-y-1">
                                                                        <span className="inline-flex rounded-full bg-sky-100 px-2.5 py-1 text-[10px] font-semibold text-sky-700">
                                                                            {item.bookingType}
                                                                        </span>
                                                                        <p className="text-xs text-slate-400">
                                                                            {item.groupSize} Person
                                                                            {item.groupSize > 1 ? "s" : ""}
                                                                        </p>
                                                                    </div>
                                                                </td>

                                                                <td className="px-4 py-4 text-sm text-slate-600">
                                                                    {item.institutionOrHospital}
                                                                </td>

                                                                <td className="px-4 py-4 text-sm text-slate-600">
                                                                    {new Date(item.registeredAt).toLocaleDateString()}
                                                                </td>

                                                                <td className="px-4 py-4 font-semibold text-slate-900">
                                                                    ${item.paymentAmount}
                                                                </td>

                                                                <td className="px-4 py-4">
                                                                    <StatusBadge status={item.status} />
                                                                </td>

                                                                <td className="px-4 py-4">
                                                                    <div className="flex items-center justify-end gap-2">
                                                                        <a
                                                                            href={`tel:${item.studentInfo.phoneNumber}`}
                                                                            className="rounded-md border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
                                                                        >
                                                                            <Phone size={14} />
                                                                        </a>

                                                                        <a
                                                                            href={`mailto:${item.studentInfo.email}`}
                                                                            className="rounded-md border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
                                                                        >
                                                                            <Mail size={14} />
                                                                        </a>

                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                onProcessRefund(item.reservationId)
                                                                            }
                                                                            className="rounded-md bg-[var(--primary)] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[var(--primary-hover)]"
                                                                        >
                                                                            Refund
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>

                                                            {isExpanded ? (
                                                                <tr className="bg-slate-50">
                                                                    <td colSpan={7} className="px-6 py-4">
                                                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                                                                            {item.members.map((member, idx) => (
                                                                                <div
                                                                                    key={member.attendeeId || idx}
                                                                                    className="rounded-xl border border-slate-200 bg-white p-4"
                                                                                >
                                                                                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                                                                        Group Member {idx + 1}
                                                                                    </p>
                                                                                    <p className="mt-2 text-sm font-semibold text-slate-900">
                                                                                        {member.fullName}
                                                                                    </p>
                                                                                    <p className="text-xs text-slate-500">
                                                                                        {member.email}
                                                                                    </p>
                                                                                    <p className="text-xs text-slate-400">
                                                                                        {member.institutionOrHospital}
                                                                                    </p>
                                                                                    <div className="mt-3">
                                                                                        <StatusBadge status={member.status} />
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>

                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                setExpandedRows((prev) => ({
                                                                                    ...prev,
                                                                                    [item.reservationId]: false,
                                                                                }))
                                                                            }
                                                                            className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-slate-500 transition hover:text-slate-700"
                                                                        >
                                                                            <ChevronUp size={14} />
                                                                            Collapse Details
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ) : null}
                                                        </Fragment>
                                                    );
                                                })
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <button
                                    type="button"
                                    onClick={downloadRosterCsv}
                                    className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                                >
                                    <Download size={14} />
                                    Download Roster (CSV)
                                </button>

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        disabled={page <= 1}
                                        onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                                        className="rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        Prev
                                    </button>

                                    <span className="text-xs font-semibold text-slate-500">
                                        Page {page} of {totalPages}
                                    </span>

                                    <button
                                        type="button"
                                        disabled={page >= totalPages}
                                        onClick={() =>
                                            setPage((prev) => Math.min(totalPages, prev + 1))
                                        }
                                        className="rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="border-t border-slate-100 px-6 py-4">
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-md bg-slate-900 px-5 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}