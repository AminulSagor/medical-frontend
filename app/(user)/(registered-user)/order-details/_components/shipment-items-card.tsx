// app/(dashboard)/_components/shipment-items-card.tsx
"use client";

import { useMemo, useState } from "react";
import ShipmentItemRow, { type ShipmentItemRowProps } from "./shipment-item-row";

type ShipmentItemsCardProps = {
    items: ShipmentItemRowProps[];
    orderNoBadge?: string; // e.g. "Order No: #ORD-8829"
    perPage?: number;      // default 3
};

export default function ShipmentItemsCard({
    items,
    orderNoBadge = "Order No: #ORD-8829",
    perPage = 3,
}: ShipmentItemsCardProps) {
    const [page, setPage] = useState(1);

    const totalPages = Math.max(1, Math.ceil(items.length / perPage));

    // keep page valid if items change
    if (page > totalPages) setPage(totalPages);

    const pageItems = useMemo(() => {
        const start = (page - 1) * perPage;
        return items.slice(start, start + perPage);
    }, [items, page, perPage]);

    const go = (p: number) => setPage(Math.min(totalPages, Math.max(1, p)));

    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_28px_rgba(15,23,42,0.06)]">
            {/* header */}
            <div className="flex items-center justify-between gap-3 bg-slate-50/60 px-6 py-4">
                <div className="text-xs font-extrabold tracking-wide text-slate-900">
                    SHIPMENT ITEMS ({items.length})
                </div>

                <div className="rounded-lg bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-500">
                    {orderNoBadge}
                </div>
            </div>

            {/* rows (3 per page) */}
            <div className="px-6">
                {pageItems.map((it, idx) => (
                    <div
                        key={`${it.sku}-${idx}`}
                        className={idx === 0 ? "" : "border-t border-slate-100"}
                    >
                        <ShipmentItemRow {...it} />
                    </div>
                ))}

                {pageItems.length === 0 && (
                    <div className="py-10 text-center text-sm text-slate-500">
                        No items found.
                    </div>
                )}
            </div>

            {/* pagination footer */}
            {totalPages > 1 && (
                <div className="border-t border-slate-100 bg-white px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="text-xs font-medium text-slate-500">
                            Page <span className="font-semibold text-slate-700">{page}</span> of{" "}
                            <span className="font-semibold text-slate-700">{totalPages}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                            <button
                                type="button"
                                onClick={() => go(page - 1)}
                                disabled={page === 1}
                                className={[
                                    "h-9 rounded-xl px-3 text-xs font-semibold ring-1 transition",
                                    page === 1
                                        ? "cursor-not-allowed bg-slate-50 text-slate-300 ring-slate-200"
                                        : "bg-white text-slate-700 ring-slate-200 hover:bg-slate-50",
                                ].join(" ")}
                            >
                                Prev
                            </button>

                            {Array.from({ length: totalPages }).map((_, i) => {
                                const p = i + 1;
                                const active = p === page;
                                return (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => go(p)}
                                        className={[
                                            "grid h-9 w-9 place-items-center rounded-xl text-xs font-semibold transition ring-1",
                                            active
                                                ? "bg-sky-50 text-sky-700 ring-sky-100"
                                                : "bg-white text-slate-700 ring-slate-200 hover:bg-slate-50",
                                        ].join(" ")}
                                    >
                                        {p}
                                    </button>
                                );
                            })}

                            <button
                                type="button"
                                onClick={() => go(page + 1)}
                                disabled={page === totalPages}
                                className={[
                                    "h-9 rounded-xl px-3 text-xs font-semibold ring-1 transition",
                                    page === totalPages
                                        ? "cursor-not-allowed bg-slate-50 text-slate-300 ring-slate-200"
                                        : "bg-white text-slate-700 ring-slate-200 hover:bg-slate-50",
                                ].join(" ")}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
