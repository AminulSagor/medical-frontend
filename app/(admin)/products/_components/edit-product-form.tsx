"use client";

import { useState } from "react";
import { Save } from "lucide-react";

export default function EditProductForm({
    productId,
}: {
    productId: string;
}) {
    const [name, setName] = useState("");
    const [price, setPrice] = useState<number | "">("");
    const [stock, setStock] = useState<number | "">("");

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
            {/* Product Info */}
            <div className="grid gap-6 md:grid-cols-2">
                <div>
                    <label className="text-sm font-medium text-slate-700">
                        Product Name
                    </label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                        placeholder="Enter product name"
                    />
                </div>

                <div>
                    <label className="text-sm font-medium text-slate-700">
                        Price
                    </label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                        placeholder="0.00"
                    />
                </div>

                <div>
                    <label className="text-sm font-medium text-slate-700">
                        Stock Quantity
                    </label>
                    <input
                        type="number"
                        value={stock}
                        onChange={(e) => setStock(Number(e.target.value))}
                        className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                        placeholder="0"
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                    type="button"
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                >
                    <Save size={16} />
                    Save Changes
                </button>
            </div>
        </div>
    );
}