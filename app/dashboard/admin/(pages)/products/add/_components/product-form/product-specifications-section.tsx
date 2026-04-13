"use client";

import { Check, Plus, Trash2, X } from "lucide-react";
import type { Spec } from "./_types";
import { Input, RightPanel, cx } from "./_shared";

export default function ProductSpecificationsSection({
    specs,
    specNameDraft,
    onSpecNameDraftChange,
    specValueDraft,
    onSpecValueDraftChange,
    onAddSpec,
    onRemoveSpec,
    onClearSpecDraft,
}: {
    specs: Spec[];
    specNameDraft: string;
    onSpecNameDraftChange: (value: string) => void;
    specValueDraft: string;
    onSpecValueDraftChange: (value: string) => void;
    onAddSpec: () => void;
    onRemoveSpec: (id: string) => void;
    onClearSpecDraft: () => void;
}) {
    return (
        <RightPanel
            title="Technical Specifications"
            right={
                <button
                    type="button"
                    onClick={() => {
                        const el = document.getElementById("spec-name-draft");
                        if (el instanceof HTMLInputElement) el.focus();
                    }}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--primary)] transition hover:opacity-80"
                >
                    <Plus size={16} />
                    ADD SPECIFICATION
                </button>
            }
        >
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                <div className="grid grid-cols-[1fr_1fr_44px] bg-slate-50 px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    <div>Spec Name</div>
                    <div>Value / Unit</div>
                    <div />
                </div>

                <div className="divide-y divide-slate-200">
                    {specs.map((spec) => (
                        <div
                            key={spec.id}
                            className="grid grid-cols-[1fr_1fr_44px] items-center px-4 py-4"
                        >
                            <p className="text-sm font-medium text-slate-900">{spec.name}</p>
                            <p className="text-sm text-slate-600">{spec.value}</p>

                            <button
                                type="button"
                                onClick={() => onRemoveSpec(spec.id)}
                                className="grid h-9 w-9 place-items-center rounded-md text-slate-300 transition hover:bg-slate-50 hover:text-slate-600"
                                aria-label="Delete spec"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}

                    <div className="grid grid-cols-[1fr_1fr_88px] items-center gap-3 px-4 py-4">
                        <Input
                            id="spec-name-draft"
                            value={specNameDraft}
                            onChange={onSpecNameDraftChange}
                            placeholder="e.g., Material"
                        />
                        <Input
                            value={specValueDraft}
                            onChange={onSpecValueDraftChange}
                            placeholder="e.g., medical-grade silicone"
                        />

                        <div className="flex items-center justify-end gap-2">
                            <button
                                type="button"
                                onClick={onAddSpec}
                                aria-label="Add spec"
                                disabled={!specNameDraft.trim() || !specValueDraft.trim()}
                                className={cx(
                                    "grid h-9 w-9 place-items-center rounded-md border transition",
                                    !specNameDraft.trim() || !specValueDraft.trim()
                                        ? "cursor-not-allowed border-slate-200 text-slate-300"
                                        : "border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary-50)]",
                                )}
                            >
                                <Check size={18} />
                            </button>

                            <button
                                type="button"
                                onClick={onClearSpecDraft}
                                aria-label="Clear draft"
                                className="grid h-9 w-9 place-items-center rounded-md border border-slate-200 text-slate-400 transition hover:bg-slate-50"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </RightPanel>
    );
}