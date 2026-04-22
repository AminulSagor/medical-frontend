// app/(dashboard)/_components/order-summary-card.tsx
type OrderSummaryCardProps = {
    shipTo: {
        name: string;
        lines: string[];
    };
    payment: {
        label: string; // "Visa ending in 4242"
    };
    totals: {
        subtotalLabel: string; // "Subtotal (3 items)"
        subtotal: string;
        shipping: string;
        tax: string;
        grandTotal: string;
    };
};

function Row({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">{label}</span>
            <span className="font-medium text-slate-800">{value}</span>
        </div>
    );
}

export default function OrderSummaryCard({ shipTo, payment, totals }: OrderSummaryCardProps) {
    return (
        <aside className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_28px_rgba(15,23,42,0.06)]">
            {/* SHIPPING TO */}
            <div className="px-6 py-5">
                <div className="text-[11px] font-extrabold tracking-wider text-slate-400">
                    SHIPPING TO
                </div>

                <div className="mt-3 text-sm font-semibold text-slate-900">{shipTo.name}</div>
                <div className="mt-2 space-y-1 text-sm text-slate-600">
                    {shipTo.lines.map((line, index) => (
                        <div key={`${line}-${index}`}>{line}</div>
                    ))}
                </div>
            </div>

            <div className="h-px bg-slate-100" />

            {/* PAYMENT */}
            <div className="px-6 py-5">
                <div className="text-[11px] font-extrabold tracking-wider text-slate-400">PAYMENT</div>

                <div className="mt-3 flex items-center gap-3 text-sm text-slate-700">
                    <span className="grid h-7 w-10 place-items-center rounded-lg bg-slate-100 ring-1 ring-slate-200">
                        💳
                    </span>
                    <span className="font-medium">{payment.label}</span>
                </div>
            </div>

            {/* totals area (light tinted) */}
            <div className="bg-sky-50/60 px-6 py-5">
                <div className="space-y-3">
                    <Row label={totals.subtotalLabel} value={totals.subtotal} />
                    <Row label="Shipping" value={totals.shipping} />
                    <Row label="Tax" value={totals.tax} />
                </div>

                <div className="my-4 h-px bg-slate-200/70" />

                <div className="flex items-end justify-between">
                    <div className="text-sm font-extrabold text-slate-900">Grand Total</div>
                    <div className="text-xl font-extrabold text-sky-600">{totals.grandTotal}</div>
                </div>
            </div>
        </aside>
    );
}
