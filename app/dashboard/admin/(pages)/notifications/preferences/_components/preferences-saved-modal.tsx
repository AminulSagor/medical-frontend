"use client";

import { Check, Bell } from "lucide-react";

export default function PreferencesSavedModal({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[999] flex items-center justify-center"
            aria-modal="true"
            role="dialog"
        >
            {/* backdrop */}
            <button
                type="button"
                onClick={onClose}
                className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
                aria-label="Close"
            />

            {/* modal */}
            <div className="relative w-[420px] max-w-[92vw] rounded-2xl bg-white p-6 shadow-2xl">
                {/* top icon */}
                <div className="mx-auto mb-3 flex w-fit flex-col items-center">
                    <div className="relative">
                        <div className="grid h-14 w-14 place-items-center rounded-full bg-cyan-50 ring-1 ring-cyan-100">
                            <Check className="text-cyan-600" size={26} />
                        </div>
                        <div className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full bg-white ring-1 ring-slate-200">
                            <Bell size={14} className="text-slate-500" />
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <p className="text-base font-semibold text-slate-900">
                        Preferences Saved Successfully
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                        Your notification preferences have been updated. You will now receive
                        alerts based on your new configuration.
                    </p>
                </div>

                {/* info table */}
                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                    <div className="grid grid-cols-[120px_1fr] gap-y-2 text-xs">
                        <p className="font-semibold text-slate-400">STATUS</p>
                        <div className="flex items-center justify-end gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            <span className="font-semibold text-emerald-600">Active</span>
                        </div>

                        <p className="font-semibold text-slate-400">CHANNELS UPDATED</p>
                        <p className="text-right font-semibold text-slate-700">
                            In-App, Email
                        </p>

                        <p className="font-semibold text-slate-400">FREQUENCY</p>
                        <p className="text-right font-semibold text-slate-700">
                            Daily Digest (Inventory)
                        </p>
                    </div>
                </div>

                {/* action */}
                <button
                    type="button"
                    onClick={onClose}
                    className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-xl bg-cyan-500 text-sm font-semibold text-white hover:bg-cyan-600 transition"
                >
                    Done
                </button>
            </div>
        </div>
    );
}