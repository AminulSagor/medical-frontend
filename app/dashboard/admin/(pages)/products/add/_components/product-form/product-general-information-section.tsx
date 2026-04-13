"use client";

import { Input, Label, RightPanel, Textarea } from "./_shared";

export default function ProductGeneralInformationSection({
    productName,
    onProductNameChange,
    clinicalDescription,
    onClinicalDescriptionChange,
}: {
    productName: string;
    onProductNameChange: (value: string) => void;
    clinicalDescription: string;
    onClinicalDescriptionChange: (value: string) => void;
}) {
    return (
        <RightPanel title="General Information">
            <div className="space-y-5">
                <div>
                    <Label>Product Name</Label>
                    <Input
                        value={productName}
                        onChange={onProductNameChange}
                        placeholder="e.g. Laryngeal Mask Airway Supreme"
                    />
                </div>

                <div>
                    <Label>Clinical Description</Label>
                    <div className="rounded-lg border border-slate-200 bg-white">
                        <div className="flex items-center gap-2 border-b border-slate-200 px-3 py-2">
                            <button
                                type="button"
                                className="rounded-md px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                            >
                                B
                            </button>
                            <button
                                type="button"
                                className="rounded-md px-2 py-1 text-xs font-semibold italic text-slate-700 hover:bg-slate-100"
                            >
                                I
                            </button>
                            <button
                                type="button"
                                className="rounded-md px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                            >
                                ≡
                            </button>
                            <button
                                type="button"
                                className="rounded-md px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                            >
                                🔗
                            </button>
                        </div>

                        <div className="px-3 py-3">
                            <Textarea
                                value={clinicalDescription}
                                onChange={onClinicalDescriptionChange}
                                placeholder="Enter clinical description and indications..."
                                rows={5}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </RightPanel>
    );
}