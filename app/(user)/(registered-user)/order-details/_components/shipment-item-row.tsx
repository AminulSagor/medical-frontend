// app/(dashboard)/_components/shipment-item-row.tsx
import Image from "next/image";

export type ShipmentItemRowProps = {
    title: string;
    sku: string;
    price: string; // keep as formatted "$120.00" for UI
    qty: number;
    meta?: string[]; // e.g. ["Size: Mac 3", "Packaging: Sterile"]
    imageSrc: string;
};

export default function ShipmentItemRow({
    title,
    sku,
    price,
    qty,
    meta = [],
    imageSrc,
}: ShipmentItemRowProps) {
    return (
        <div className="flex gap-4 py-6">
            {/* thumbnail */}
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl ring-1 ring-slate-200">
                <Image src={imageSrc} alt={title} fill className="object-cover" />
            </div>

            {/* info */}
            <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-slate-900">{title}</div>
                        <div className="mt-1 text-[11px] text-slate-400">
                            SKU: <span className="font-medium text-slate-500">{sku}</span>
                        </div>

                        {meta.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500">
                                {meta.map((m) => (
                                    <span key={m}>{m}</span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="shrink-0 text-right">
                        <div className="text-sm font-semibold text-slate-900">{price}</div>
                        <div className="mt-1 text-[11px] text-slate-400">Qty: {qty}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
