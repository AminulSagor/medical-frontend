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