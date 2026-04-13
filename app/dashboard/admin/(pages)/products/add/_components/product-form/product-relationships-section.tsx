"use client";

import { X } from "lucide-react";
import { Input, Label, LeftPanel } from "./_shared";

export default function ProductRelationshipsSection({
    fbSearch,
    onFbSearchChange,
    fbItems,
    onRemoveFbItem,
}: {
    fbSearch: string;
    onFbSearchChange: (value: string) => void;
    fbItems: string[];
    onRemoveFbItem: (index: number) => void;
}) {
    return (
        <LeftPanel title="Product Relationships">
            <div className="space-y-5">
                <div>
                    <Label>Frequently Bought Together</Label>
                    <div className="flex items-center gap-2">
                        <div className="relative w-full">
                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                🔍
                            </span>
                            <Input
                                value={fbSearch}
                                onChange={onFbSearchChange}
                                placeholder="Search products..."
                                className="pl-9"
                            />
                        </div>
                    </div>

                    <div className="mt-3 space-y-2">
                        {fbItems.map((item, index) => (
                            <div
                                key={`${item}_${index}`}
                                className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2"
                            >
                                <p className="text-sm text-slate-800">{item}</p>
                                <button
                                    type="button"
                                    onClick={() => onRemoveFbItem(index)}
                                    className="grid h-8 w-8 place-items-center rounded-md text-slate-500 transition hover:bg-slate-100"
                                    aria-label="Remove"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </LeftPanel>
    );
}