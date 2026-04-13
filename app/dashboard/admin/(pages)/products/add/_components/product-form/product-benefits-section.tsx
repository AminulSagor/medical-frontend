"use client";

import { Plus, Shield } from "lucide-react";
import type { Benefit } from "./_types";
import { Input, Label, RightPanel } from "./_shared";

export default function ProductBenefitsSection({
    benefits,
    onAddBenefit,
    onChangeBenefitTitle,
    onChangeBenefitDescription,
}: {
    benefits: Benefit[];
    onAddBenefit: () => void;
    onChangeBenefitTitle: (id: string, value: string) => void;
    onChangeBenefitDescription: (id: string, value: string) => void;
}) {
    return (
        <RightPanel
            title="Clinical Benefits & Indications"
            right={
                <button
                    type="button"
                    onClick={onAddBenefit}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--primary)] transition hover:opacity-80"
                >
                    <Plus size={16} />
                    ADD BENEFIT CARD
                </button>
            }
        >
            <div className="space-y-4">
                {benefits.map((benefit) => (
                    <div
                        key={benefit.id}
                        className="rounded-lg border border-slate-200 bg-white px-5 py-5"
                    >
                        <div className="grid gap-4 md:grid-cols-[220px,1fr]">
                            <div>
                                <Label>Icon</Label>
                                <div className="flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700">
                                    <Shield size={16} className="text-slate-500" />
                                    Shield (Protection)
                                </div>
                            </div>

                            <div>
                                <Label>Benefit Title</Label>
                                <Input
                                    value={benefit.title}
                                    onChange={(value) => onChangeBenefitTitle(benefit.id, value)}
                                    placeholder="e.g. Gastric Access"
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <Label>Description</Label>
                            <Input
                                value={benefit.description}
                                onChange={(value) => onChangeBenefitDescription(benefit.id, value)}
                                placeholder="Explain the clinical benefit..."
                            />
                        </div>
                    </div>
                ))}

                <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-xs text-slate-500">
                    Click "Add Benefit Card" to showcase key product advantages.
                </div>
            </div>
        </RightPanel>
    );
}