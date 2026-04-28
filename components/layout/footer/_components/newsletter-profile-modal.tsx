"use client";

import { X } from "lucide-react";
import type { NewsletterProfileForm } from "@/components/layout/footer/_hooks/use-newsletter-subscription";

type NewsletterProfileModalProps = {
    open: boolean;
    form: NewsletterProfileForm;
    errorMessage: string;
    isSubmitting: boolean;
    onClose: () => void;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    onFormChange: (field: keyof NewsletterProfileForm, value: string) => void;
};

export default function NewsletterProfileModal({
    open,
    form,
    errorMessage,
    isSubmitting,
    onClose,
    onSubmit,
    onFormChange,
}: NewsletterProfileModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-extrabold text-black">
                            You're in! What should we call you?
                        </h2>

                        <p className="mt-1 text-sm text-light-slate">
                            Complete your profile now, or skip this step.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-light-slate/20 text-light-slate transition hover:bg-light-slate/5"
                        aria-label="Close profile modal"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="mt-5 space-y-3">
                    <ProfileInput
                        value={form.fullName}
                        placeholder="Name"
                        disabled={isSubmitting}
                        onChange={(value) => onFormChange("fullName", value)}
                    />

                    <ProfileInput
                        value={form.clinicalRole}
                        placeholder="Clinical role (optional)"
                        disabled={isSubmitting}
                        onChange={(value) => onFormChange("clinicalRole", value)}
                    />

                    <ProfileInput
                        type="tel"
                        value={form.phone}
                        placeholder="Phone (optional)"
                        disabled={isSubmitting}
                        onChange={(value) => onFormChange("phone", value)}
                    />

                    <ProfileInput
                        value={form.institution}
                        placeholder="Institution (optional)"
                        disabled={isSubmitting}
                        onChange={(value) => onFormChange("institution", value)}
                    />

                    {errorMessage ? (
                        <p className="text-sm text-red-600">{errorMessage}</p>
                    ) : null}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="h-11 w-full rounded-full bg-primary text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {isSubmitting ? "Saving..." : "Save Profile"}
                    </button>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="h-10 w-full rounded-full text-sm font-semibold text-light-slate transition hover:bg-light-slate/5"
                    >
                        Skip for now
                    </button>
                </form>
            </div>
        </div>
    );
}

function ProfileInput({
    type = "text",
    value,
    placeholder,
    disabled,
    onChange,
}: {
    type?: string;
    value: string;
    placeholder: string;
    disabled: boolean;
    onChange: (value: string) => void;
}) {
    return (
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className="h-11 w-full rounded-xl border border-light-slate/20 px-4 text-sm text-black outline-none transition placeholder:text-light-slate focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
        />
    );
}