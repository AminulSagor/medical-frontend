import { AlertTriangle } from "lucide-react";

const ITEMS = [
    { name: "Adult Airway Card", left: "2 units left" },
    { name: "Pediatric Manikin Kit", left: "1 unit left" },
    { name: "Intubation Trainer", left: "3 units left" },
];

export default function LowStockAlert() {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {/* red top border */}
            <div className="h-1 w-full bg-rose-500" />

            <div className="p-5">
                {/* header */}
                <div className="flex items-start gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-rose-50 ring-1 ring-rose-100 text-rose-600">
                        <AlertTriangle size={18} />
                    </div>

                    <div>
                        <p className="text-base font-semibold text-slate-900">Low Stock Alert</p>
                        <p className="text-sm text-slate-500">Items needing restock</p>
                    </div>
                </div>

                {/* items */}
                <div className="mt-4 space-y-3">
                    {ITEMS.map((it) => (
                        <div
                            key={it.name}
                            className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-4 py-3"
                        >
                            <p className="text-sm font-medium text-slate-700">{it.name}</p>

                            <span className="rounded-md bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                                {it.left}
                            </span>
                        </div>
                    ))}
                </div>

                {/* footer link */}
                <button
                    type="button"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)] hover:opacity-90"
                >
                    Manage Inventory <span aria-hidden>›</span>
                </button>
            </div>
        </div>
    );
}