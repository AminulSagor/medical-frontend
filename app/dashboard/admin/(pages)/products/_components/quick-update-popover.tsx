"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export default function QuickUpdatePopover({
    anchorEl,
    open,
    stock,
    price,
    saving = false,
    error = null,
    onClose,
    onSave,
}: {
    anchorEl: HTMLElement | null;
    open: boolean;
    stock: number;
    price: number;
    saving?: boolean;
    error?: string | null;
    onClose: () => void;
    onSave: (v: { stock: number; price: number }) => void;
}) {
    const wrapRef = useRef<HTMLDivElement | null>(null);
    const stockInputRef = useRef<HTMLInputElement | null>(null);

    const [nextStock, setNextStock] = useState("");
    const [nextPrice, setNextPrice] = useState("");

    useEffect(() => {
        if (!open) return;
        setNextStock(String(stock));
        setNextPrice(price.toFixed(2));
        requestAnimationFrame(() => stockInputRef.current?.focus());
    }, [open, stock, price]);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape" && !saving) onClose();
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open, onClose, saving]);

    const pos = useMemo(() => {
        if (!anchorEl) return null;
        const r = anchorEl.getBoundingClientRect();
        const top = r.bottom + 10;
        const left = r.right - 280;
        return { top: Math.max(8, top), left: Math.max(8, left) };
    }, [anchorEl]);

    const parsedStock =
        nextStock.trim() === "" ? stock : Math.max(0, parseInt(nextStock, 10) || 0);

    const parsedPrice =
        nextPrice.trim() === "" ? price : Math.max(0, Number(nextPrice) || 0);

    const isValidPrice = nextPrice.trim() === "" || !Number.isNaN(Number(nextPrice));
    const isValidStock = nextStock.trim() === "" || /^\d+$/.test(nextStock);
    const canSave = !saving && isValidPrice && isValidStock && parsedPrice >= 0;

    if (!open || !pos) return null;

    return createPortal(
        <div
            style={{ position: "fixed", inset: 0, zIndex: 9999 }}
            onMouseDown={(e) => {
                const box = wrapRef.current;
                if (!box || saving) return;
                if (!box.contains(e.target as Node)) onClose();
            }}
        >
            <div
                ref={wrapRef}
                style={{ position: "fixed", top: pos.top, left: pos.left }}
            >
                <div className="w-[280px] rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
                    <div className="flex items-center justify-between">
                        <p className="text-[11px] font-extrabold uppercase tracking-wide text-slate-500">
                            Quick Update
                        </p>

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            className="grid h-8 w-8 place-items-center rounded-md text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                            aria-label="Close"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    <div className="mt-3 space-y-3">
                        <div>
                            <p className="text-xs font-semibold text-slate-700">
                                Stock Quantity
                            </p>

                            <div className="mt-1 flex items-center gap-2">
                                <button
                                    className="grid h-9 w-9 place-items-center rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                    onClick={() => {
                                        setNextStock(String(Math.max(0, parsedStock - 1)));
                                    }}
                                    disabled={saving}
                                    type="button"
                                >
                                    −
                                </button>

                                <input
                                    ref={stockInputRef}
                                    value={nextStock}
                                    placeholder="0"
                                    onChange={(e) => {
                                        const cleaned = e.target.value.replace(/[^\d]/g, "");
                                        setNextStock(cleaned);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && canSave) {
                                            onSave({ stock: parsedStock, price: parsedPrice });
                                        }
                                    }}
                                    inputMode="numeric"
                                    disabled={saving}
                                    className="h-9 flex-1 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 caret-slate-900 outline-none focus:ring-2 focus:ring-[var(--primary)]/20 disabled:cursor-not-allowed disabled:bg-slate-50"
                                />

                                <button
                                    className="grid h-9 w-9 place-items-center rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                    onClick={() => {
                                        setNextStock(String(parsedStock + 1));
                                    }}
                                    disabled={saving}
                                    type="button"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <div>
                            <p className="text-xs font-semibold text-slate-700">Price (USD)</p>

                            <div className="relative mt-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                                    $
                                </span>

                                <input
                                    value={nextPrice}
                                    placeholder="0.00"
                                    onChange={(e) => {
                                        const cleaned = e.target.value
                                            .replace(/[^\d.]/g, "")
                                            .replace(/(\..*)\./g, "$1");
                                        setNextPrice(cleaned);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && canSave) {
                                            onSave({ stock: parsedStock, price: parsedPrice });
                                        }
                                    }}
                                    inputMode="decimal"
                                    disabled={saving}
                                    className="h-9 w-full rounded-md border border-slate-200 bg-white pl-7 pr-3 text-sm text-slate-900 placeholder:text-slate-400 caret-slate-900 outline-none focus:ring-2 focus:ring-[var(--primary)]/20 disabled:cursor-not-allowed disabled:bg-slate-50"
                                />
                            </div>
                        </div>
                    </div>

                    {error ? (
                        <p className="mt-3 text-xs font-medium text-red-600">{error}</p>
                    ) : null}

                    <div className="mt-6 flex gap-4">
                        <button
                            type="button"
                            className="flex-1 rounded-xl bg-slate-100 py-3 text-base font-semibold text-slate-700 hover:bg-slate-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                            onClick={onClose}
                            disabled={saving}
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            className="flex-1 rounded-xl bg-[var(--primary)] py-3 text-base font-semibold text-white shadow-sm hover:bg-[var(--primary-hover)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                            onClick={() => {
                                onSave({ stock: parsedStock, price: parsedPrice });
                            }}
                            disabled={!canSave}
                        >
                            {saving ? "Saving..." : "Save"}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body,
    );
}