"use client";

import { MoreHorizontal, IdCard } from "lucide-react";
import type { ClinicalRole, MedicalDesignation } from "./clinical-credentials-card";

const ROLE_LABEL: Record<NonNullable<ClinicalRole>, string> = {
    anesthesiologist: "Anesthesiologist",
    crna: "CRNA",
    icu: "ICU",
    ent: "ENT",
};

const DESIG_LABEL: Record<NonNullable<MedicalDesignation>, string> = {
    md: "MD",
    do: "DO",
    crna: "CRNA",
};

export default function LivePreviewCard({
    initials,
    fullName,
    role,
    designation,
    email,
    institution,
    photoUrl,
    assignedUserRole,
}: {
    initials: string;
    fullName: string;
    role: ClinicalRole | null;
    designation: MedicalDesignation | null;
    email: string;
    institution?: string;
    photoUrl?: string | null;
    assignedUserRole?: string;
}) {
    const roleText = role ? ROLE_LABEL[role] : "—";
    const desigText = designation ? DESIG_LABEL[designation] : "—";

    // dummy
    const memberId = "NEW_USR_2024";

    return (
        <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200 shadow-sm">
            <div className="mb-4">
                <div className="text-[11px] font-extrabold tracking-wide text-slate-500">
                    LIVE PROFILE PREVIEW
                </div>
            </div>

            {/* preview card (like your 2nd screenshot) */}
            <div
                className={[
                    "relative w-fit max-w-[420px] overflow-hidden rounded-2xl",
                    "bg-white ring-1 ring-slate-200",
                    "shadow-[0_20px_55px_rgba(15,23,42,0.14)]",
                ].join(" ")}
            >
                {/* top content */}
                <div className="flex items-start gap-4 p-5">
                    {/* avatar */}
                    <div className="shrink-0">
                        <div className="grid h-[64px] w-[64px] place-items-center overflow-hidden rounded-full bg-[var(--primary-50)] ring-1 ring-[var(--primary)]/15">
                            {photoUrl ? (
                                <img
                                    src={photoUrl}
                                    alt="Profile"
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="text-lg font-extrabold text-[var(--primary)]">
                                    {initials}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* main */}
                    <div className="min-w-0 flex-1">
                        {/* Name */}
                        <div className="flex items-center gap-2">
                            <div className="truncate text-base font-extrabold text-slate-900">
                                {fullName || "—"}
                            </div>
                        </div>

                        {/* Clinical role + designation */}
                        <div className="mt-2 flex items-center gap-3">
                            <div className="text-sm font-semibold text-slate-800">
                                {roleText}
                            </div>

                            <span
                                className={[
                                    "inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-[11px] font-extrabold",
                                    "bg-[var(--primary)]/10 text-[var(--primary)] ring-1 ring-[var(--primary)]/20",
                                ].join(" ")}
                            >
                                {desigText}
                            </span>
                        </div>

                        {/* Assigned role + default status (like screenshot) */}
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            {assignedUserRole?.trim() ? (
                                <span
                                    className={[
                                        "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-extrabold uppercase",
                                        "bg-[var(--primary)] text-white",
                                    ].join(" ")}
                                >
                                    {assignedUserRole.toUpperCase()}
                                </span>
                            ) : null}

                            <span
                                className={[
                                    "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-extrabold uppercase",
                                    "bg-[var(--primary)]/10 text-[var(--primary)] ring-1 ring-[var(--primary)]/20",
                                ].join(" ")}
                            >
                                NEW USER
                            </span>
                        </div>

                        {/* institute identity */}
                        <div className="mt-3">
                            <div className="text-[10px] font-extrabold tracking-wide text-slate-500">
                                INSTITUTE IDENTITY
                            </div>
                            <div className="mt-1 text-[12px] text-slate-600">
                                {institution?.trim() ? institution : email || "—"}
                            </div>
                        </div>
                    </div>

                    {/* right icon */}
                    <div className="shrink-0">
                        <div className="grid h-[64px] w-[64px] place-items-center rounded-2xl bg-slate-100 text-slate-300">
                            <IdCard size={36} strokeWidth={1.6} />
                        </div>
                    </div>
                </div>

                {/* footer strip */}
                <div className="flex items-center justify-between border-t border-slate-200 bg-[var(--primary-50)]/40 px-5 py-3">
                    <div className="text-[10px] font-extrabold tracking-wide text-slate-500">
                        MEMBER ID: <span className="text-slate-700">{memberId}</span>
                    </div>

                    {/* dummy 3 dots */}
                    <button
                        type="button"
                        className="grid h-8 w-8 place-items-center rounded-full hover:bg-slate-100 active:scale-95 transition"
                        aria-label="More"
                    >
                        <MoreHorizontal size={18} className="text-[var(--primary)]" />
                    </button>
                </div>
            </div>
        </div>
    );
}