"use client";

import React, { useEffect, useState } from "react";
import Dialog from "@/components/dialogs/dialog";
import type { SubscriberProfileEditableFields } from "../types/subscriber-profile.type";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialValues: SubscriberProfileEditableFields;
    onSubmit: (values: SubscriberProfileEditableFields) => Promise<void>;
};

export default function EditSubscriberProfileDialog({
    open,
    onOpenChange,
    initialValues,
    onSubmit,
}: Props) {
    const [form, setForm] =
        useState<SubscriberProfileEditableFields>(initialValues);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setForm(initialValues);
    }, [initialValues, open]);

    const handleChange = (
        key: keyof SubscriberProfileEditableFields,
        value: string,
    ) => {
        setForm((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);
            await onSubmit({
                fullName: form.fullName.trim(),
                clinicalRole: form.clinicalRole.trim(),
                phone: form.phone.trim(),
                institution: form.institution.trim(),
            });
            onOpenChange(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
            size="md"
            className="rounded-2xl"
        >
            <div className="space-y-6">
                <div>
                    <h2 className="text-lg font-bold text-slate-900">Edit Profile</h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Update subscriber profile details.
                    </p>
                </div>

                <div className="grid gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                            Full Name
                        </label>
                        <input
                            value={form.fullName}
                            onChange={(e) => handleChange("fullName", e.target.value)}
                            className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-teal-500"
                            placeholder="Enter full name"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                            Clinical Role
                        </label>
                        <input
                            value={form.clinicalRole}
                            onChange={(e) => handleChange("clinicalRole", e.target.value)}
                            className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-teal-500"
                            placeholder="Enter clinical role"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                            Phone
                        </label>
                        <input
                            value={form.phone}
                            onChange={(e) => handleChange("phone", e.target.value)}
                            className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-teal-500"
                            placeholder="Enter phone number"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                            Institution
                        </label>
                        <input
                            value={form.institution}
                            onChange={(e) => handleChange("institution", e.target.value)}
                            className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-teal-500"
                            placeholder="Enter institution"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => onOpenChange(false)}
                        className="inline-flex h-11 items-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting || !form.fullName.trim()}
                        className="inline-flex h-11 items-center rounded-2xl bg-[#0e8f86] px-5 text-sm font-semibold text-white hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </Dialog>
    );
}