"use client";

import { Download, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProductsToolbar({
    onExport,
}: {
    onExport: () => void;
}) {
    const router = useRouter();

    return (
        <div className="flex items-center gap-3">
            {/* Export Button */}
            <button
                type="button"
                onClick={onExport}
                className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-200 hover:text-slate-900 active:scale-[0.98]"
            >
                <Download size={16} />
                Export
            </button>

            {/* Add Product Button */}
            <button
                type="button"
                onClick={() => router.push("/dashboard/admin/products/add")}
                className="inline-flex items-center gap-2 rounded-md bg-[var(--primary)] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[var(--primary-hover)] active:scale-[0.98]"
            >
                <Plus size={16} />
                Add Product
            </button>
        </div>
    );
}