"use client";

import { ClipboardList } from "lucide-react";
import ThemeDropdown from "../theme-dropdown";

export type ClinicalRole = "anesthesiologist" | "crna" | "icu" | "ent";
export type MedicalDesignation = "md" | "do" | "crna";

export type ClinicalCredentialsValue = {
    role: ClinicalRole | null;
    designation: MedicalDesignation | null;
    institution: string;
    npi: string;
};

export default function ClinicalCredentialsCard({
    value,
    onChange,
    onActivate,
}: {
    value: ClinicalCredentialsValue;
    onChange: (patch: Partial<ClinicalCredentialsValue>) => void;
    onActivate?: () => void;
}) {
    return (
        <div
            className={[
                "rounded-2xl bg-white p-6 ring-1 ring-slate-200",
                "shadow-[0_18px_45px_rgba(15,23,42,0.10)]",
            ].join(" ")}
            // ✅ if anything inside gets focus, activate step 2
            onFocusCapture={onActivate}
        >
            {/* header */}
            <div className="mb-6 flex items-center gap-2">
                <ClipboardList size={18} className="text-[var(--primary)]" />
                <div>
                    <h2 className="text-lg font-extrabold text-slate-900">Clinical Credentials</h2>
                    <p className="text-xs text-slate-500">Role, designation, licensing.</p>
                </div>
            </div>

            {/* content */}
            <div className="grid gap-5 md:grid-cols-2">
                <div>
                    <label className="text-[11px] font-bold tracking-wide text-slate-600">
                        PRIMARY CLINICAL ROLE
                    </label>

                    <ThemeDropdown<ClinicalRole>
                        value={value.role}
                        onChange={(v) => onChange({ role: v })}
                        placeholder="Select role"
                        options={[
                            { value: "anesthesiologist", label: "Anesthesiologist" },
                            { value: "crna", label: "CRNA" },
                            { value: "icu", label: "ICU" },
                            { value: "ent", label: "ENT" },
                        ]}
                        // ✅ click on dropdown should also activate
                        onOpen={() => onActivate?.()}
                    />
                </div>

                <div>
                    <label className="text-[11px] font-bold tracking-wide text-slate-600">
                        MEDICAL DESIGNATION
                    </label>

                    <ThemeDropdown<MedicalDesignation>
                        value={value.designation}
                        onChange={(v) => onChange({ designation: v })}
                        placeholder="Select designation"
                        options={[
                            { value: "md", label: "MD" },
                            { value: "do", label: "DO" },
                            { value: "crna", label: "CRNA" },
                        ]}
                        onOpen={() => onActivate?.()}
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="text-[11px] font-bold tracking-wide text-slate-600">
                        INSTITUTION / HOSPITAL
                    </label>
                    <input
                        value={value.institution}
                        onFocus={() => onActivate?.()}
                        onChange={(e) => onChange({ institution: e.target.value })}
                        className={[
                            "mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm",
                            "text-slate-900 placeholder:text-slate-400",
                            "outline-none transition",
                            "focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15",
                        ].join(" ")}
                        placeholder="e.g. Memorial Hermann Hospital"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="text-[11px] font-bold tracking-wide text-slate-600">
                        MEDICAL LICENSE / NPI NUMBER
                    </label>
                    <input
                        value={value.npi}
                        onFocus={() => onActivate?.()}
                        onChange={(e) => onChange({ npi: e.target.value })}
                        className={[
                            "mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm",
                            "text-slate-900 placeholder:text-slate-400",
                            "outline-none transition",
                            "focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15",
                        ].join(" ")}
                        placeholder="10-digit NPI number"
                    />
                </div>
            </div>
        </div>
    );
}