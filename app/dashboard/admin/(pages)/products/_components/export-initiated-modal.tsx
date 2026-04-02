"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Upload } from "lucide-react";

export default function ExportInitiatedModal({
    open,
    onClose,
    totalRecords,
    filterLabel,
}: {
    open: boolean;
    onClose: () => void;
    totalRecords: number;
    filterLabel: string; // e.g. "All Products"
}) {
    const panelRef = useRef<HTMLDivElement | null>(null);

    // close: outside click + ESC
    useEffect(() => {
        if (!open) return;

        const onDown = (e: MouseEvent) => {
            const t = e.target as Node;
            if (panelRef.current && !panelRef.current.contains(t)) onClose();
        };

        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        document.addEventListener("mousedown", onDown);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onDown);
            document.removeEventListener("keydown", onKey);
        };
    }, [open, onClose]);

    // prevent background scroll
    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [open]);

    if (!open) return null;

    return createPortal(
        <div className="fixed inset-0 z-[80]">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/35 backdrop-blur-sm" />

            {/* Center modal */}
            <div className="relative z-[81] flex min-h-full items-center justify-center px-4 py-10">
                <div
                    ref={panelRef}
                    className="w-full max-w-[520px] rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200"
                >
                    <div className="px-8 pt-8 text-center">
                        {/* icon */}
                        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[var(--primary-50)]">
                            <div className="grid h-12 w-12 place-items-center rounded-full bg-white ring-1 ring-slate-200">
                                <Upload className="text-[var(--primary)]" size={22} />
                            </div>
                        </div>

                        <h3 className="mt-5 text-xl font-extrabold text-slate-900">
                            Export Initiated
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Your inventory export has been started. The file will be ready for
                            download in a few moments. We will notify you when it&apos;s
                            complete.
                        </p>

                        {/* details card */}
                        <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 px-5 py-4 text-left">
                            <div className="flex items-center justify-between gap-4 py-1">
                                <p className="text-sm text-slate-500">Format:</p>
                                <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800">
                                    <span className="text-slate-400">📄</span>
                                    CSV (Excel)
                                </div>
                            </div>

                            <div className="flex items-center justify-between gap-4 py-1">
                                <p className="text-sm text-slate-500">Total Records:</p>
                                <p className="text-sm font-semibold text-slate-900">
                                    {totalRecords.toLocaleString()} Products
                                </p>
                            </div>

                            <div className="flex items-center justify-between gap-4 py-1">
                                <p className="text-sm text-slate-500">Filter Applied:</p>
                                <span className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700">
                                    {filterLabel}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* footer button */}
                    <div className="px-8 pb-8 pt-7">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full rounded-xl bg-[var(--primary)] py-3.5 text-sm font-bold text-white shadow-sm hover:bg-[var(--primary-hover)] active:scale-[0.99]"
                        >
                            Done
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}