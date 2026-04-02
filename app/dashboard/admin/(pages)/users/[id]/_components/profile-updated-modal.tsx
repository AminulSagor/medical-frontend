"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Check } from "lucide-react";

export default function ProfileUpdatedModal({
    open,
    profileName,
    roleText,
    lastUpdatedText = "Just now",
    onClose,
    onDone,
}: {
    open: boolean;
    profileName: string;
    roleText: string;
    lastUpdatedText?: string;
    onClose: () => void;
    onDone: () => void;
}) {
    // ESC close
    useEffect(() => {
        if (!open) return;

        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    // lock scroll
    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [open]);

    if (!open) return null;

    return createPortal(
        <div className="fixed inset-0 z-[999]">
            {/* overlay */}
            <button
                type="button"
                aria-label="Close modal"
                onClick={onClose}
                className="absolute inset-0 bg-black/30"
            />

            {/* dialog */}
            <div className="absolute inset-0 grid place-items-center p-4">
                <div className="w-full max-w-[340px] rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-slate-200">
                    {/* icon */}
                    <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[var(--primary)] text-white shadow-[0_12px_30px_rgba(34,195,238,0.28)]">
                        <Check size={26} strokeWidth={3} />
                    </div>

                    <div className="mt-5 text-center">
                        <div className="text-lg font-extrabold text-slate-900">
                            Profile Updated Successfully
                        </div>
                        <div className="mt-2 text-xs leading-5 text-slate-500">
                            The professional profile, clinical credentials, and teaching parameters have been successfully saved
                            to the institute database.
                        </div>
                    </div>

                    {/* info box */}
                    <div className="mt-5 rounded-2xl bg-slate-50 px-5 py-4 ring-1 ring-slate-200">
                        <div className="grid grid-cols-[110px_1fr] gap-y-3 text-xs">
                            <div className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">
                                Profile
                            </div>
                            <div className="text-right font-semibold text-slate-800">
                                {profileName}
                            </div>

                            <div className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">
                                Role
                            </div>
                            <div className="text-right font-semibold text-slate-800">
                                {roleText}
                            </div>

                            <div className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">
                                Last Updated
                            </div>
                            <div className="flex items-center justify-end gap-2 text-[var(--primary)] font-semibold">
                                <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
                                {lastUpdatedText}
                            </div>
                        </div>
                    </div>

                    {/* button */}
                    <button
                        type="button"
                        onClick={onDone}
                        className="mt-6 w-full rounded-2xl bg-[var(--primary)] px-4 py-3 text-sm font-extrabold text-white transition hover:brightness-95 active:scale-[0.99]"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}