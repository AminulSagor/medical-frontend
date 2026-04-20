"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, X } from "lucide-react";

import {
    confirmWorkshopRefund,
    getWorkshopRefundPreview,
} from "@/service/admin/workshop.service";
import type {
    RefundPreviewMember,
    WorkshopRefundPreviewResponse,
} from "@/types/admin/workshop.types";

type RefundSuccessData = {
    traineeName: string;
    refundedAmount: string;
    paymentGateway: string;
    transactionId: string;
};

export default function RefundPreviewModal({
    open,
    workshopId,
    reservationId,
    onClose,
    onSuccess,
}: {
    open: boolean;
    workshopId: string;
    reservationId: string | null;
    onClose: () => void;
    onSuccess: (data: RefundSuccessData) => void;
}) {
    const [loading, setLoading] = useState(false);
    const [confirming, setConfirming] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [response, setResponse] = useState<WorkshopRefundPreviewResponse | null>(
        null,
    );
    const [selectedAttendeeIds, setSelectedAttendeeIds] = useState<string[]>([]);
    const [adjustmentNote, setAdjustmentNote] = useState("");
    const [paymentGateway, setPaymentGateway] = useState("");
    const [transactionId, setTransactionId] = useState("");

    useEffect(() => {
        if (!open || !workshopId || !reservationId) return;

        setLoading(true);
        setError(null);

        getWorkshopRefundPreview(workshopId, reservationId)
            .then((res) => {
                setResponse(res);
                setPaymentGateway(res.data.paymentGateway || "");
                setTransactionId(res.data.transactionId || "");
                setAdjustmentNote("");

                const refundableMembers = res.data.members.filter(
                    (member) => member.isRefundable,
                );

                const initialSelected = refundableMembers
                    .slice(0, res.data.summary.selectedCount || refundableMembers.length)
                    .map((member) => member.attendeeId);

                setSelectedAttendeeIds(initialSelected);
            })
            .catch((err) => {
                setError(
                    err instanceof Error ? err.message : "Failed to load refund preview.",
                );
            })
            .finally(() => {
                setLoading(false);
            });
    }, [open, workshopId, reservationId]);

    const selectedMembers = useMemo(() => {
        return (response?.data.members ?? []).filter((member) =>
            selectedAttendeeIds.includes(member.attendeeId),
        );
    }, [response, selectedAttendeeIds]);

    const calculatedRefundAmount = useMemo(() => {
        return selectedMembers.reduce((sum, member) => {
            return sum + Number(member.refundAmount || 0);
        }, 0);
    }, [selectedMembers]);

    function toggleMember(member: RefundPreviewMember) {
        if (!member.isRefundable) return;

        setSelectedAttendeeIds((prev) =>
            prev.includes(member.attendeeId)
                ? prev.filter((id) => id !== member.attendeeId)
                : [...prev, member.attendeeId],
        );
    }

    async function handleConfirmRefund() {
        if (!response || !reservationId || selectedAttendeeIds.length === 0) return;

        setConfirming(true);
        setError(null);

        try {
            const confirmResponse = await confirmWorkshopRefund(workshopId, {
                reservationId,
                attendeeIds: selectedAttendeeIds,
                refundAmount: calculatedRefundAmount.toFixed(2),
                adjustmentNote,
                paymentGateway,
                transactionId,
            });

            onSuccess({
                traineeName: response.data.bookingOwner.fullName ?? "—",
                refundedAmount:
                    confirmResponse.data?.refundedAmount ||
                    calculatedRefundAmount.toFixed(2),
                paymentGateway: confirmResponse.data?.paymentGateway || paymentGateway,
                transactionId: confirmResponse.data?.transactionId || transactionId,
            });
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to confirm refund.",
            );
        } finally {
            setConfirming(false);
        }
    }

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
            <div className="flex w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl" style={{ maxHeight: "88vh" }}>
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Process Refund</h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Group Booking: {response?.data.bookingOwner.fullName ?? "—"}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
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
                    ) : response ? (
                        <>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                        Seats Booked
                                    </p>
                                    <p className="mt-1 text-lg font-bold text-slate-900">
                                        {response.data.groupSize} Persons
                                    </p>
                                </div>

                                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-right">
                                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                        Total Paid
                                    </p>
                                    <p className="mt-1 text-lg font-bold text-slate-900">
                                        ${response.data.totalPaid}
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-500">
                                Select the individual members for whom the client has requested a
                                refund. These records will be updated upon confirmation.
                            </div>

                            <div className="space-y-2">
                                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                    Select Members to Refund
                                </p>

                                <div className="overflow-hidden rounded-xl border border-slate-200">
                                    {response.data.members.map((member) => {
                                        const checked = selectedAttendeeIds.includes(member.attendeeId);

                                        return (
                                            <button
                                                key={member.attendeeId}
                                                type="button"
                                                onClick={() => toggleMember(member)}
                                                className="flex w-full items-start justify-between gap-3 border-t border-slate-100 px-4 py-3 text-left first:border-t-0"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <input
                                                        type="checkbox"
                                                        checked={checked}
                                                        readOnly
                                                        disabled={!member.isRefundable}
                                                        className="mt-1 h-4 w-4 rounded border-slate-300 text-[var(--primary)]"
                                                    />

                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-900">
                                                            {member.fullName}
                                                        </p>
                                                        <p className="text-xs text-slate-500">
                                                            {member.email}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="text-right">
                                                    <p className="text-sm font-semibold text-slate-900">
                                                        ${member.refundAmount}
                                                    </p>
                                                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                                        {member.refundStatus}
                                                    </p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="flex items-start gap-2 text-xs text-slate-500">
                                    <AlertCircle size={14} className="mt-0.5 text-slate-400" />
                                    <p>
                                        Selected members will be marked as Refunded and removed from
                                        the active course roster upon confirmation.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                        Refund Quantity
                                    </label>
                                    <input
                                        value={selectedAttendeeIds.length}
                                        readOnly
                                        className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-900 outline-none"
                                    />
                                    <p className="mt-1 text-[10px] text-slate-400">
                                        Driven by selection above
                                    </p>
                                </div>

                                <div>
                                    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                        Calculated Refund Amount
                                    </label>
                                    <input
                                        value={`$ ${calculatedRefundAmount.toFixed(2)}`}
                                        readOnly
                                        className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-900 outline-none"
                                    />
                                    <p className="mt-1 text-[10px] text-slate-400">
                                        You can adjust the amount manually later
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                    Adjustment Note
                                </label>
                                <textarea
                                    value={adjustmentNote}
                                    onChange={(e) => setAdjustmentNote(e.target.value)}
                                    placeholder="Reason for refund or adjustment details..."
                                    className="min-h-[96px] w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[var(--primary)]"
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                        Payment Gateway
                                    </label>
                                    <input
                                        value={paymentGateway}
                                        onChange={(e) => setPaymentGateway(e.target.value)}
                                        placeholder="e.g. Stripe"
                                        className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[var(--primary)]"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                        Transaction ID
                                    </label>
                                    <input
                                        value={transactionId}
                                        onChange={(e) => setTransactionId(e.target.value)}
                                        placeholder="e.g. txn_..."
                                        className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[var(--primary)]"
                                    />
                                </div>
                            </div>

                            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700">
                                Reminder: Please ensure the refund has been manually sent in the
                                third-party payment software before confirming the refund status
                                here.
                            </div>
                        </>
                    ) : null}
                </div>

                <div className="border-t border-slate-100 px-6 py-4">
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-md border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            disabled={
                                !response || selectedAttendeeIds.length === 0 || confirming
                            }
                            onClick={handleConfirmRefund}
                            className="inline-flex items-center gap-2 rounded-md bg-[var(--primary)] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {confirming ? (
                                <Loader2 size={14} className="animate-spin" />
                            ) : (
                                <CheckCircle2 size={14} />
                            )}
                            Confirm Refund
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}