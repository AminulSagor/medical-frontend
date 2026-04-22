"use client";

import React from "react";
import { FileText } from "lucide-react";

type Props = {
    eyebrow?: string;
    title?: string;
    updatedText?: string;
};

export default function TermsOfServiceHero({
    eyebrow = "TEXAS AIRWAY INSTITUTE",
    title = "Terms of Service",
    updatedText = "Last Updated: October 24, 2023",
}: Props) {
    return (
        <section className="relative w-full overflow-hidden pt-16">
            <div className="absolute inset-0 bg-[#dff1fb]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.8),_transparent_60%)]" />

            <div className="relative mx-auto flex w-full max-w-[1100px] flex-col items-center px-4 py-10 text-center sm:py-12">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/80 shadow-sm">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                        <FileText className="h-5 w-5 text-white" />
                    </div>
                </div>

                <p className="mt-5 text-xs font-semibold tracking-widest text-primary">
                    {eyebrow}
                </p>

                <h1 className="mt-2 text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
                    {title}
                </h1>

                <p className="mt-3 text-sm text-slate-500">{updatedText}</p>
            </div>
        </section>
    );
}