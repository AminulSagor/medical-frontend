"use client";

import { ArrowLeft, ExternalLink, Loader2 } from "lucide-react";
import { GhostButton, PrimaryButton } from "./_shared";

export default function ProductFormHeader({
    mode,
    isSubmitting,
    onBack,
    onDiscard,
    onSubmit,
}: {
    mode: "add" | "edit";
    isSubmitting: boolean;
    onBack: () => void;
    onDiscard: () => void;
    onSubmit: () => void;
}) {
    return (
        <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
                <button
                    type="button"
                    onClick={onBack}
                    className="mt-1 grid h-9 w-9 place-items-center rounded-md text-slate-500 transition hover:bg-white hover:ring-1 hover:ring-slate-200"
                    aria-label="Back"
                >
                    <ArrowLeft size={18} />
                </button>
                <div>
                    <h1 className="text-lg font-bold text-slate-900">
                        {mode === "edit" ? "Edit Product" : "Add New Product"}
                    </h1>
                    <p className="text-xs text-slate-500">
                        Texas Airway Institute · Clinical Catalog Manager
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <GhostButton onClick={onDiscard}>Discard</GhostButton>

                <PrimaryButton onClick={onSubmit} disabled={isSubmitting}>
                    <span className="inline-flex items-center gap-2">
                        {isSubmitting ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                {mode === "edit" ? "Saving..." : "Publishing..."}
                            </>
                        ) : (
                            <>
                                {mode === "edit" ? "Save Changes" : "Publish Product"}
                                <ExternalLink size={16} />
                            </>
                        )}
                    </span>
                </PrimaryButton>
            </div>
        </div>
    );
}