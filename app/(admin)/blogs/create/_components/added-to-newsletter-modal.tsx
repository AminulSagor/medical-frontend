"use client";

import React from "react";
import { Check } from "lucide-react";

function cx(...parts: Array<string | false | null | undefined>) {
    return parts.filter(Boolean).join(" ");
}

export default function AddedToNewsletterModal({
    articleTitle,
    newsletterLabel,
    queuePosition,
    onClose,
    onGoManager,
    onDone,
}: {
    articleTitle: string;
    newsletterLabel: string;
    queuePosition: string; // ex: "#5"
    onClose: () => void;
    onGoManager: () => void;
    onDone: () => void;
}) {
    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
            {/* backdrop */}
            <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
            />

            <div className="relative w-full max-w-[440px] rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
                {/* top icon */}
                <div className="mx-auto grid h-[78px] w-[78px] place-items-center rounded-full bg-[var(--primary-50)]">
                    <span className="grid h-10 w-10 place-items-center rounded-full border border-[var(--primary)] bg-white text-[var(--primary)]">
                        <Check size={18} />
                    </span>
                </div>

                <h3 className="mt-5 text-center text-xl font-extrabold text-slate-900">
                    Added to Newsletter
                </h3>

                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                        Article
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                        {articleTitle}
                    </p>

                    <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                Newsletter
                            </p>
                            <p className="mt-1 text-xs font-semibold text-slate-700">
                                {newsletterLabel}
                            </p>
                        </div>

                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                Queue Position
                            </p>
                            <p className="mt-1 text-xs font-extrabold text-[var(--primary)]">
                                {queuePosition}
                            </p>
                        </div>
                    </div>
                </div>

                <p className="mt-4 text-center text-xs leading-5 text-slate-500">
                    This article has been successfully added to your monthly newsletter
                    queue. You can manage the sequence of articles in the Newsletter
                    Manager.
                </p>

                <button
                    type="button"
                    onClick={onGoManager}
                    className="mt-5 h-11 w-full rounded-md bg-[var(--primary)] text-sm font-semibold text-white hover:bg-[var(--primary-hover)] transition"
                >
                    Go to Newsletter Manager
                </button>

                <button
                    type="button"
                    onClick={onDone}
                    className={cx(
                        "mt-3 h-11 w-full rounded-md border border-slate-200 bg-white",
                        "text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                    )}
                >
                    Done
                </button>
            </div>
        </div>
    );
}