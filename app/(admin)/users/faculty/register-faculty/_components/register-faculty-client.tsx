"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import FacultyStepper, { FacultyStepKey } from "./register-faculty-stepper";
import AccountDetailsCard from "./sections/account-details-card";
import ClinicalCredentialsCard, {
    type ClinicalRole,
    type MedicalDesignation,
} from "./sections/clinical-credentials-card";
import LivePreviewCard from "./sections/live-preview-card";
import type { AccountDetailsValue } from "./sections/account-details-card";
import type { ClinicalCredentialsValue } from "./sections/clinical-credentials-card";
import AdjustProfilePhotoModal from "./modals/adjust-profile-photo-modal";
import RoleAssignmentCard from "./sections/role-assignment-card";


export type FacultyDraft = {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;

    role: ClinicalRole | null;
    designation: MedicalDesignation | null;
    institution: string;
    npi: string;

    assignedUserRole: string;
    photoDataUrl: string | null;
};

function getInitials(firstName: string, lastName: string) {
    const f = (firstName?.trim()?.[0] ?? "").toUpperCase();
    const l = (lastName?.trim()?.[0] ?? "").toUpperCase();
    const both = `${f}${l}`.trim();
    return both || "NA";
}

export default function RegisterFacultyClient() {
    const router = useRouter();
    const [openPhotoModal, setOpenPhotoModal] = useState(false);
    const steps = useMemo(
        () =>
            [
                { key: "account", title: "Account", subtitle: "Identity details" },
                { key: "clinical", title: "Clinical Profile", subtitle: "Credentials" },
                { key: "role", title: "Role Assignment", subtitle: "Designate user role" },
            ] as const,
        []
    );

    const [activeStep, setActiveStep] = useState<FacultyStepKey>("account");

    const [draft, setDraft] = useState<FacultyDraft>({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        role: "anesthesiologist",
        designation: "md",
        institution: "",
        npi: "",
        photoDataUrl: null,
        assignedUserRole: "",
    });

    const onDraftChange = <K extends keyof FacultyDraft>(key: K, value: FacultyDraft[K]) => {
        setDraft((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <div className="mx-auto w-full max-w-[980px]">
            {/* Header */}
            <div className="mb-6 flex items-start gap-3">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition"
                    aria-label="Go back"
                >
                    <ArrowLeft size={16} className="text-[var(--primary)]" />
                </button>

                <div className="min-w-0">
                    <h1 className="text-xl font-extrabold text-slate-900">Register New Faculty</h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Establish identity and clinical profile for the new member.
                    </p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
                {/* Left stepper */}
                <div className="pt-2">
                    <FacultyStepper steps={steps} activeKey={activeStep} clickable={false} />
                </div>

                {/* Right content */}
                <div className="space-y-5">
                    {/* ✅ Step 1: show Account card only when activeStep === "account" */}
                    {activeStep === "account" && (
                        <div onFocusCapture={() => setActiveStep("account")}>
                            <AccountDetailsCard
                                value={{
                                    firstName: draft.firstName,
                                    lastName: draft.lastName,
                                    phone: draft.phone,
                                    email: draft.email,
                                }}
                                onChange={(patch: Partial<AccountDetailsValue>) =>
                                    setDraft((prev) => ({ ...prev, ...patch }))
                                }
                                photoUrl={draft.photoDataUrl}
                                onOpenPhotoModal={() => setOpenPhotoModal(true)}
                            />
                        </div>
                    )}

                    {/* ✅ Step 1 + Step 2: Clinical card should show for account + clinical */}
                    {(activeStep === "account" || activeStep === "clinical") && (
                        <div onFocusCapture={() => setActiveStep("clinical")}>
                            <ClinicalCredentialsCard
                                value={{
                                    role: draft.role,
                                    designation: draft.designation,
                                    institution: draft.institution,
                                    npi: draft.npi,
                                }}
                                onChange={(patch: Partial<ClinicalCredentialsValue>) =>
                                    setDraft((prev) => ({ ...prev, ...patch }))
                                }
                                onActivate={() => setActiveStep("clinical")}
                            />
                        </div>
                    )}

                    {activeStep === "role" && (
                        <div onFocusCapture={() => setActiveStep("role")}>
                            <RoleAssignmentCard
                                value={draft.assignedUserRole}
                                onChange={(v) => setDraft((prev) => ({ ...prev, assignedUserRole: v }))}
                                onActivate={() => setActiveStep("role")}
                            />
                        </div>
                    )}

                    {/* Live preview always visible like your screenshots */}
                    <LivePreviewCard
                        initials={getInitials(draft.firstName, draft.lastName)}
                        fullName={`${draft.firstName} ${draft.lastName}`.trim() || "—"}
                        role={draft.role}
                        designation={draft.designation}
                        email={draft.email || "—"}
                        institution={draft.institution || undefined}
                        photoUrl={draft.photoDataUrl}
                        assignedUserRole={draft.assignedUserRole}
                    />

                    {/* Bottom actions (keep yours, no change needed) */}
                    <div className="mt-6 flex items-center justify-between">
                        <button
                            type="button"
                            onClick={() => {
                                if (activeStep === "clinical") return setActiveStep("account");
                                if (activeStep === "role") return setActiveStep("clinical");
                                router.back();
                            }}
                            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:border-slate-400 transition"
                        >
                            <ArrowLeft size={16} className="text-slate-500" />
                            {activeStep === "account"
                                ? "Back: Account Details"
                                : activeStep === "clinical"
                                    ? "Back: Account"
                                    : "Back: Clinical Profile"}
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                if (activeStep === "account") return setActiveStep("clinical");
                                if (activeStep === "clinical") return setActiveStep("role");
                                // activeStep === "role" -> later: submit
                            }}
                            className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[var(--primary-hover)] transition"
                        >
                            {activeStep === "role" ? (
                                <>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <circle cx="12" cy="12" r="10" />
                                        <path d="M9 12l2 2 4-4" />
                                    </svg>
                                    Complete Registration
                                </>
                            ) : activeStep === "clinical" ? (
                                <>
                                    Next: Role Assignment
                                    <span className="text-white/90">→</span>
                                </>
                            ) : (
                                <>
                                    Next: Clinical Profile
                                    <span className="text-white/90">→</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <AdjustProfilePhotoModal
                open={openPhotoModal}
                onClose={() => setOpenPhotoModal(false)}
                initialImage={draft.photoDataUrl}
                previewName={`${draft.firstName} ${draft.lastName}`.trim() || "—"}
                previewRole={draft.role ? String(draft.role).toUpperCase() : "—"}
                onApply={(dataUrl) => {
                    setDraft((prev) => ({ ...prev, photoDataUrl: dataUrl }));
                    setOpenPhotoModal(false);
                }}
            />
        </div>
    );
}


