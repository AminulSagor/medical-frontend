"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { RefreshCw } from "lucide-react";

type OrderStatus = "processing" | "shipped" | "received";

function pillClass(active: boolean) {
    return [
        "inline-flex items-center justify-center rounded-full px-6 py-2 text-xs font-extrabold uppercase border",
        active
            ? "border-[var(--primary)]/40 bg-[var(--primary-50)] text-[var(--primary)]"
            : "border-slate-300 bg-slate-200 text-slate-500",
    ].join(" ");
}

function labelOf(s: OrderStatus) {
    if (s === "processing") return "Processing";
    if (s === "shipped") return "Shipped";
    return "Received";
}

export default function UpdateOrderStatusModal({
    open,
    orderId,
    fromStatus,
    toStatus,
    onClose,
    onConfirm,
}: {
    open: boolean;
    orderId: string;
    fromStatus: OrderStatus;
    toStatus: OrderStatus;
    onClose: () => void;
    onConfirm: () => void;
}) {
    // lock background scroll while modal is open
    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [open]);

    // esc to close
    useEffect(() => {
        if (!open) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open, onClose]);

    if (!open) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999]">
            {/* Backdrop */}
            <button
                type="button"
                aria-label="Close modal"
                onClick={onClose}
                className="absolute inset-0 bg-black/35 backdrop-blur-[2px]"
            />

            {/* Modal */}
            <div className="relative flex h-full w-full items-center justify-center p-4">
                <div className="w-full max-w-[420px] rounded-3xl bg-white p-8 shadow-2xl">
                    {/* Icon */}
                    <div className="flex justify-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary)] text-white shadow-md">
                            <RefreshCw size={20} />
                        </div>
                    </div>

                    <div className="mt-5 text-center">
                        <div className="text-lg font-extrabold text-slate-900">
                            Update Order Status
                        </div>

                        <p className="mt-2 text-sm font-medium text-slate-500">
                            You are about to update the status for{" "}
                            <span className="font-extrabold text-slate-700">
                                Order #{orderId}
                            </span>
                            . This action will be recorded in the event timeline and the
                            customer will receive an automated notification.
                        </p>
                    </div>

                    {/* Status Preview */}
                    <div className="mt-6 flex justify-center">
                        <div className="flex items-center gap-4 rounded-full bg-slate-100 px-4 py-3 mx-4">
                            {toStatus === "processing" ? (
                                <span className={pillClass(true)}>{labelOf("processing")}</span>
                            ) : toStatus === "shipped" ? (
                                <>
                                    <span className={pillClass(false)}>{labelOf("processing")}</span>
                                    <span className="text-slate-500 text-2xl font-bold leading-none">→</span>
                                    <span className={pillClass(true)}>{labelOf("shipped")}</span>
                                </>
                            ) : (
                                <>
                                    <span className={pillClass(false)}>{labelOf("shipped")}</span>
                                    <span className="text-slate-500 text-2xl font-bold leading-none">→</span>
                                    <span className={pillClass(true)}>{labelOf("received")}</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-7 space-y-3">
                        <button
                            type="button"
                            onClick={onConfirm}
                            className={[
                                "w-full rounded-full px-6 py-3 text-sm font-extrabold text-white",
                                "bg-[var(--primary)] hover:bg-[var(--primary-hover)] active:scale-[0.99]",
                            ].join(" ")}
                        >
                            Confirm &amp; Update Status
                        </button>

                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full text-sm font-semibold text-slate-400 hover:text-slate-600"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}