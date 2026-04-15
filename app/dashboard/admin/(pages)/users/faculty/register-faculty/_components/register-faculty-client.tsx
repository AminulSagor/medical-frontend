"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import FacultyStepper, { FacultyStepKey } from "./register-faculty-stepper";
import AccountDetailsCard from "./sections/account-details-card";
import ClinicalCredentialsCard from "./sections/clinical-credentials-card";
import LivePreviewCard from "./sections/live-preview-card";
import type { AccountDetailsValue } from "./sections/account-details-card";
import type { ClinicalCredentialsValue } from "./sections/clinical-credentials-card";
import AdjustProfilePhotoModal from "./modals/adjust-profile-photo-modal";
import RoleAssignmentCard from "./sections/role-assignment-card";
import { registerFaculty } from "@/service/admin/faculty.service";
import { uploadFile } from "@/utils/upload";
import { registerFacultySchema } from "@/schema/admin/faculty.schema";
import type { RegisterFacultyRequest } from "@/types/admin/faculty.types";


export type FacultyDraft = {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    primaryClinicalRole: ClinicalCredentialsValue["primaryClinicalRole"];
    medicalDesignation: ClinicalCredentialsValue["medicalDesignation"];
    institutionOrHospital: string;
    npiNumber: string;
    assignedRole: string;
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
    const [submitting, setSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [apiError, setApiError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const steps = useMemo(
        () =>
            [
                { key: "account", title: "Account", subtitle: "Identity details" },
                { key: "clinical", title: "Clinical Profile", subtitle: "Credentials" },
                { key: "role", title: "Role Assignment", subtitle: "System permissions" },
            ] as const,
        []
    );

    const [activeStep, setActiveStep] = useState<FacultyStepKey>("account");

    const [draft, setDraft] = useState<FacultyDraft>({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        primaryClinicalRole: "",
        medicalDesignation: "",
        institutionOrHospital: "",
        npiNumber: "",
        photoDataUrl: null,
        assignedRole: "instructor",
    });

    const applyDraftPatch = (patch: Partial<FacultyDraft>) => {
        setDraft((prev) => ({ ...prev, ...patch }));

        const patchKeys = Object.keys(patch);
        if (patchKeys.length === 0) return;

        setValidationErrors((prev) => {
            const next = { ...prev };
            patchKeys.forEach((key) => delete next[key]);
            return next;
        });
    };

    // Convert dataUrl to File for upload
    const dataUrlToFile = async (dataUrl: string, fileName: string): Promise<File> => {
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        return new File([blob], fileName, { type: blob.type });
    };

    const handleSubmit = async () => {
        setApiError(null);
        setValidationErrors({});

        const formData: RegisterFacultyRequest = {
            firstName: draft.firstName.trim(),
            lastName: draft.lastName.trim(),
            phoneNumber: draft.phoneNumber.trim(),
            email: draft.email.trim(),
            npiNumber: draft.npiNumber.trim(),
            assignedRole: draft.assignedRole.trim(),
            ...(draft.primaryClinicalRole
                ? { primaryClinicalRole: draft.primaryClinicalRole }
                : {}),
            ...(draft.medicalDesignation
                ? { medicalDesignation: draft.medicalDesignation }
                : {}),
            ...(draft.institutionOrHospital.trim()
                ? { institutionOrHospital: draft.institutionOrHospital.trim() }
                : {}),
        };

        // Validate with Zod
        const result = registerFacultySchema.safeParse(formData);
        if (!result.success) {
            const errors: Record<string, string> = {};
            result.error.issues.forEach((issue) => {
                const field = issue.path[0] as string;
                if (!errors[field]) {
                    errors[field] = issue.message;
                }
            });
            setValidationErrors(errors);
            return;
        }

        setSubmitting(true);

        try {
            let imageUrl: string | undefined;

            // Upload photo if exists
            if (draft.photoDataUrl) {
                const file = await dataUrlToFile(draft.photoDataUrl, `faculty-${Date.now()}.png`);
                const uploadResult = await uploadFile(file, {
                    folder: "users",
                    onProgress: setUploadProgress,
                });

                if (!uploadResult.success) {
                    throw new Error(uploadResult.error || "Failed to upload photo");
                }

                imageUrl = uploadResult.readUrl;
            }

            const payload: RegisterFacultyRequest = {
                ...result.data,
                ...(imageUrl ? { imageUrl } : {}),
            };

            // Submit faculty registration
            await registerFaculty(payload);

            // Success - redirect to users list
            router.push("/dashboard/admin/users");
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { message?: string } } };
            setApiError(
                axiosErr?.response?.data?.message ||
                (err instanceof Error ? err.message : "Failed to register faculty")
            );
        } finally {
            setSubmitting(false);
            setUploadProgress(0);
        }
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
                                    phoneNumber: draft.phoneNumber,
                                    email: draft.email,
                                }}
                                onChange={(patch: Partial<AccountDetailsValue>) =>
                                    applyDraftPatch(patch)
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
                                    primaryClinicalRole: draft.primaryClinicalRole,
                                    medicalDesignation: draft.medicalDesignation,
                                    institutionOrHospital: draft.institutionOrHospital,
                                    npiNumber: draft.npiNumber,
                                }}
                                onChange={(patch: Partial<ClinicalCredentialsValue>) =>
                                    applyDraftPatch(patch)
                                }
                                onActivate={() => setActiveStep("clinical")}
                            />
                        </div>
                    )}

                    {activeStep === "role" && (
                        <div onFocusCapture={() => setActiveStep("role")}>
                            <RoleAssignmentCard
                                value={draft.assignedRole}
                                onActivate={() => setActiveStep("role")}
                            />
                        </div>
                    )}

                    {/* Live preview always visible like your screenshots */}
                    <LivePreviewCard
                        initials={getInitials(draft.firstName, draft.lastName)}
                        fullName={`${draft.firstName} ${draft.lastName}`.trim() || "—"}
                        primaryClinicalRole={draft.primaryClinicalRole || undefined}
                        medicalDesignation={draft.medicalDesignation || undefined}
                        email={draft.email || "—"}
                        institutionOrHospital={draft.institutionOrHospital || undefined}
                        photoUrl={draft.photoDataUrl}
                        assignedRole={draft.assignedRole}
                    />

                    {/* API Error */}
                    {apiError && (
                        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
                            <p className="text-sm text-rose-600">{apiError}</p>
                        </div>
                    )}

                    {/* Validation Errors Summary */}
                    {Object.keys(validationErrors).length > 0 && (
                        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                            <p className="text-sm font-semibold text-amber-700 mb-2">Please fix the following errors:</p>
                            <ul className="list-disc list-inside text-sm text-amber-600">
                                {Object.entries(validationErrors).map(([field, error]) => (
                                    <li key={field}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Upload Progress */}
                    {submitting && uploadProgress > 0 && uploadProgress < 100 && (
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-sm text-slate-600 mb-2">Uploading photo... {uploadProgress}%</p>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                                <div
                                    className="bg-[var(--primary)] h-2 rounded-full transition-all"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Bottom actions */}
                    <div className="mt-6 flex items-center justify-between">
                        <button
                            type="button"
                            disabled={submitting}
                            onClick={() => {
                                if (activeStep === "clinical") return setActiveStep("account");
                                if (activeStep === "role") return setActiveStep("clinical");
                                router.back();
                            }}
                            className={[
                                "inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:border-slate-400 transition",
                                submitting && "opacity-50 cursor-not-allowed",
                            ].join(" ")}
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
                            disabled={submitting}
                            onClick={() => {
                                if (activeStep === "account") return setActiveStep("clinical");
                                if (activeStep === "clinical") return setActiveStep("role");
                                // activeStep === "role" -> submit
                                handleSubmit();
                            }}
                            className={[
                                "inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[var(--primary-hover)] transition",
                                submitting && "opacity-50 cursor-not-allowed",
                            ].join(" ")}
                        >
                            {activeStep === "role" ? (
                                submitting ? (
                                    <>
                                        <svg
                                            className="animate-spin h-5 w-5"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            />
                                        </svg>
                                        Registering...
                                    </>
                                ) : (
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
                                )
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
                previewRole={draft.primaryClinicalRole || "—"}
                onApply={(dataUrl) => {
                    applyDraftPatch({ photoDataUrl: dataUrl });
                    setOpenPhotoModal(false);
                }}
            />
        </div>
    );
}


