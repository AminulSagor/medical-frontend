"use client";

import { Download } from "lucide-react";

export default function OrdersToolbar({
    onDownload,
    onNewOrder,
}: {
    onDownload: () => void;
    onNewOrder: () => void;
}) {
    return (
        <div className="flex items-center justify-end gap-2">
            <button
                type="button"
                onClick={onDownload}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
                <Download size={16} />
                Download CSV
            </button>

            <button
                type="button"
                onClick={onNewOrder}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-4 py-2 text-xs font-semibold text-white hover:bg-[var(--primary-hover)]"
            >
                <span className="text-base leading-none">+</span>
                New Order
            </button>
        </div>
    );
}