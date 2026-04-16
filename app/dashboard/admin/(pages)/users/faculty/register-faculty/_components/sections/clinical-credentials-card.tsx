"use client";

import { ClipboardList } from "lucide-react";
import ThemeDropdown from "../theme-dropdown";

export type PrimaryClinicalRole =
    | "Anesthesiologist"
    | "CRNA"
    | "ICU Specialist"
    | "ENT Specialist";

export type MedicalDesignation = "MD" | "DO" | "CRNA";

export type ClinicalCredentialsValue = {
    primaryClinicalRole: PrimaryClinicalRole | "";
    medicalDesignation: MedicalDesignation | "";
    institutionOrHospital: string;
    npiNumber: string;
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
                        PRIMARY CLINICAL ROLE (OPTIONAL)
                    </label>

                    <ThemeDropdown<PrimaryClinicalRole>
                        value={value.primaryClinicalRole || null}
                        onChange={(v) => onChange({ primaryClinicalRole: v })}
                        placeholder="Select role"
                        options={[
                            { value: "Anesthesiologist", label: "Anesthesiologist" },
                            { value: "CRNA", label: "CRNA" },
                            { value: "ICU Specialist", label: "ICU Specialist" },
                            { value: "ENT Specialist", label: "ENT Specialist" },
                        ]}
                        // ✅ click on dropdown should also activate
                        onOpen={() => onActivate?.()}
                    />
                </div>

                <div>
                    <label className="text-[11px] font-bold tracking-wide text-slate-600">
                        MEDICAL DESIGNATION (OPTIONAL)
                    </label>

                    <ThemeDropdown<MedicalDesignation>
                        value={value.medicalDesignation || null}
                        onChange={(v) => onChange({ medicalDesignation: v })}
                        placeholder="Select designation"
                        options={[
                            { value: "MD", label: "MD" },
                            { value: "DO", label: "DO" },
                            { value: "CRNA", label: "CRNA" },
                        ]}
                        onOpen={() => onActivate?.()}
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="text-[11px] font-bold tracking-wide text-slate-600">
                        INSTITUTION / HOSPITAL (OPTIONAL)
                    </label>
                    <input
                        value={value.institutionOrHospital}
                        onFocus={() => onActivate?.()}
                        onChange={(e) =>
                            onChange({ institutionOrHospital: e.target.value })
                        }
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
                        value={value.npiNumber}
                        onFocus={() => onActivate?.()}
                        onChange={(e) => {
                            const cleaned = e.target.value.replace(/\D/g, "").slice(0, 10);
                            onChange({ npiNumber: cleaned });
                        }}
                        className={[
                            "mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm",
                            "text-slate-900 placeholder:text-slate-400",
                            "outline-none transition",
                            "focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15",
                        ].join(" ")}
                        placeholder="10-digit NPI number"
                        inputMode="numeric"
                    />
                </div>
            </div>
        </div>
    );
}