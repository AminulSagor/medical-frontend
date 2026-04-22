"use client";

import { CheckCircle2 } from "lucide-react";

type RefundSuccessData = {
    traineeName: string;
    refundedAmount: string;
    paymentGateway: string;
    transactionId: string;
};

export default function RefundSuccessModal({
    open,
    data,
    onClose,
}: {
    open: boolean;
    data: RefundSuccessData | null;
    onClose: () => void;
}) {
    if (!open || !data) return null;

    return (
        <div className="fixed inset-0 z-[95] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-white px-6 py-6 shadow-2xl">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[var(--primary-50)] text-[var(--primary)]">
                    <CheckCircle2 size={20} />
                </div>

                <h3 className="mt-4 text-center text-xl font-bold text-slate-900">
                    Refund Status Updated Successfully
                </h3>

                <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 first:border-t-0">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                            Booking Owner
                        </p>
                        <p className="text-sm font-semibold text-slate-900">
                            {data.traineeName}
                        </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                            Refunded Amount
                        </p>
                        <p className="text-sm font-semibold text-slate-900">
                            ${data.refundedAmount}
                        </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                            Payment Gateway
                        </p>
                        <p className="text-sm font-semibold text-slate-900">
                            {data.paymentGateway || "—"}
                        </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                            Transaction ID
                        </p>
                        <p className="max-w-[180px] truncate text-sm font-semibold text-slate-900">
                            {data.transactionId || "—"}
                        </p>
                    </div>
                </div>

                <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-500">
                    The system has been updated. A confirmation email can be sent to the
                    booking owner regarding this refund.
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className="mt-5 w-full rounded-md bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--primary-hover)]"
                >
                    Done
                </button>
            </div>
        </div>
    );
}