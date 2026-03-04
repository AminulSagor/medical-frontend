"use client";

import React, { useEffect } from "react";
import { X, CheckCircle2 } from "lucide-react";

function cx(...parts: Array<string | false | null | undefined>) {
    return parts.filter(Boolean).join(" ");
}

export default function ProductUpdatedModal({
    open,
    onClose,
    productName,
    sku,
    statusLabel,
    stockLabel,
}: {
    open: boolean;
    onClose: () => void;
    productName: string;
    sku: string;
    statusLabel: string;
    stockLabel: string;
}) {
    useEffect(() => {
        if (!open) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[9999]">
            <button
                type="button"
                aria-label="Close overlay"
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
            />

            <div className="relative mx-auto flex min-h-full w-full items-center justify-center p-4">
                <div className="relative w-full max-w-[560px] rounded-3xl bg-white shadow-[0_20px_60px_rgba(15,23,42,0.25)] ring-1 ring-slate-200">
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition"
                    >
                        <X size={18} />
                    </button>

                    <div className="px-8 pb-8 pt-10">
                        <div className="mx-auto grid w-fit place-items-center">
                            <div className="grid h-24 w-24 place-items-center rounded-full bg-emerald-50">
                                <div className="grid h-14 w-14 place-items-center rounded-full bg-white ring-1 ring-slate-200">
                                    <CheckCircle2 className="text-emerald-600" size={26} />
                                </div>
                            </div>
                        </div>

                        <h3 className="mt-6 text-center text-[28px] font-extrabold tracking-tight text-slate-900">
                            Product Updated Successfully
                        </h3>
                        <p className="mx-auto mt-2 max-w-[460px] text-center text-sm leading-6 text-slate-500">
                            The product details have been successfully saved and published to the clinical shop.
                        </p>

                        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6">
                            <div className="grid grid-cols-[110px_1fr] gap-y-4 text-sm">
                                <p className="text-slate-500">Product</p>
                                <p className="text-right font-semibold text-slate-900">{productName}</p>

                                <p className="text-slate-500">SKU</p>
                                <p className="text-right font-semibold text-slate-900">{sku}</p>

                                <p className="text-slate-500">Status</p>
                                <div className="flex items-center justify-end gap-2 text-emerald-600 font-semibold">
                                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                                    <span>{statusLabel}</span>
                                </div>

                                <p className="text-slate-500">Stock</p>
                                <p className="text-right font-semibold text-slate-900">{stockLabel}</p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className={cx(
                                "mt-7 w-full rounded-2xl px-5 py-4 text-base font-semibold text-white transition shadow-sm",
                                "bg-[var(--primary)] hover:bg-[var(--primary-hover)]"
                            )}
                        >
                            Done
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}