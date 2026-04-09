"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ProfileUpdatedModal from "../_components/profile-updated-modal";
import {
    getAdminUserById,
    updateAdminUserById,
    updateAdminUserStatus,
} from "@/service/admin/users.service";
import type {
    AdminDirectoryApiRole,
    AdminDirectoryStatus,
} from "@/types/admin/users.types";

type ReadonlyUserProfile = {
    id: string;
    role: "Student" | "Instructor";
    apiRole: AdminDirectoryApiRole;
    name: string;
    titleLine: string;
    email: string;
    phone: string;
    credential: string;
    professionalRole: string;
    institution: string;
    npi?: string;
    joined: string;
    avatarSrc: string;
    accountActive: boolean;
    internalNotes: string;
    firstName: string;
    lastName: string;
    meta: {
        bottomLastUpdatedText: string;
    };
};

function Switch({
    checked,
    onChange,
    ariaLabel,
}: {
    checked: boolean;
    onChange: (v: boolean) => void;
    ariaLabel: string;
}) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            aria-label={ariaLabel}
            onClick={() => onChange(!checked)}
            className={[
                "relative inline-flex h-6 w-11 items-center rounded-full transition",
                checked ? "bg-[var(--primary)]" : "bg-slate-200",
            ].join(" ")}
        >
            <span
                className={[
                    "inline-block h-5 w-5 transform rounded-full bg-white shadow transition",
                    checked ? "translate-x-5" : "translate-x-1",
                ].join(" ")}
            />
        </button>
    );
}

function ReadOnlyField({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div>
            <div className="text-sm font-extrabold text-slate-900">{label}</div>
            <div className="mt-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">
                {value || "—"}
            </div>
        </div>
    );
}

export default function Page() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const id = typeof params?.id === "string" ? params.id : "";

    const [openSuccess, setOpenSuccess] = useState(false);
    const [data, setData] = useState<ReadonlyUserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [accountActive, setAccountActive] = useState(false);
    const [internalNotes, setInternalNotes] = useState("");

    useEffect(() => {
        if (!id) return;

        let ignore = false;

        const loadUser = async () => {
            try {
                setLoading(true);

                const res = await getAdminUserById(decodeURIComponent(id));
                const user = res.data;

                if (ignore) return;

                const isInstructor = user.role === "instructor";
                const isStudentLike =
                    user.role === "student" || user.role === "user";

                setData({
                    id: user.id,
                    role: isInstructor ? "Instructor" : "Student",
                    apiRole: user.role,
                    name: user.fullName,
                    titleLine: isInstructor
                        ? "Update clinician details and account status"
                        : "Update student account status",
                    email: user.email,
                    phone: user.phoneNumber || "+1 (555) 012-3456",
                    credential:
                        user.professionalTitle ||
                        user.credentials ||
                        user.professionalRole ||
                        (isStudentLike ? "Student" : "Instructor"),
                    professionalRole: user.professionalRole || "",
                    institution: user.institutionOrHospital || "—",
                    npi: user.npiNumber || "—",
                    joined: user.joinedDate || "—",
                    avatarSrc: user.profilePhoto || "/photos/image.png",
                    accountActive: user.status === "active",
                    internalNotes: "",
                    firstName: user.firstName || "",
                    lastName: user.lastName || "",
                    meta: {
                        bottomLastUpdatedText: `Last updated: ${user.updatedAt || "—"}`,
                    },
                });
            } catch (error) {
                console.error("Failed to load user for edit:", error);
                if (!ignore) {
                    setData(null);
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        };

        loadUser();

        return () => {
            ignore = true;
        };
    }, [id]);

    useEffect(() => {
        if (!data) return;
        setAccountActive(data.accountActive);
        setInternalNotes(data.internalNotes);
    }, [data]);

    const currentStatus = useMemo<AdminDirectoryStatus>(
        () => (accountActive ? "active" : "inactive"),
        [accountActive]
    );

    if (loading) {
        return (
            <div className="mx-auto w-full max-w-[1180px] space-y-3 pt-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                    <div className="text-sm font-semibold text-slate-900">Loading user...</div>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="mx-auto w-full max-w-[1180px] space-y-3 pt-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                    <div className="text-sm font-semibold text-slate-900">User not found</div>
                    <div className="mt-1 text-sm text-slate-500">
                        No data for id: <span className="font-mono">{id}</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => router.push("/dashboard/admin/users")}
                        className="mt-4 inline-flex items-center gap-2 rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white hover:brightness-95"
                    >
                        <ArrowLeft size={16} />
                        Back to Users
                    </button>
                </div>
            </div>
        );
    }

    const onDiscard = () => {
        setAccountActive(data.accountActive);
        setInternalNotes(data.internalNotes);
    };

    const onSave = async () => {
        try {
            setIsSaving(true);

            await updateAdminUserById(data.id, {
                firstName: data.firstName,
                lastName: data.lastName,
                phoneNumber: data.phone,
                title: data.credential,
                professionalRole: data.professionalRole || data.credential,
                role: data.apiRole,
                status: currentStatus,
                institutionOrHospital: data.institution,
                npiNumber: data.npi === "—" ? "" : data.npi ?? "",
                profilePicture:
                    data.avatarSrc && data.avatarSrc !== "/photos/image.png"
                        ? data.avatarSrc
                        : "",
            });

            if (currentStatus !== (data.accountActive ? "active" : "inactive")) {
                await updateAdminUserStatus(data.id, {
                    status: currentStatus,
                });
            }

            setData((prev) =>
                prev
                    ? {
                        ...prev,
                        accountActive,
                        internalNotes,
                        meta: {
                            bottomLastUpdatedText: "Last updated: Just now",
                        },
                    }
                    : prev
            );

            setOpenSuccess(true);
        } catch (error) {
            console.error("Failed to save user profile:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const firstName = data.firstName || "";
    const lastName = data.lastName || "";
    const email = data.email ?? "";
    const phone = data.phone ?? "";
    const clinicalRole = data.role;
    const medicalDesignation = data.credential ?? "";
    const institution = data.institution ?? "";
    const npiNumber = data.npi ?? "—";

    return (
        <div className="mx-auto w-full max-w-[1180px] pb-24 pt-6">
            <div className="flex items-start gap-3">
                <button
                    type="button"
                    onClick={() =>
                        router.push(
                            `/dashboard/admin/users/${encodeURIComponent(data.id)}`
                        )
                    }
                    className="grid h-9 w-9 place-items-center rounded-full border border-[var(--primary)]/20 bg-[var(--primary-50)] text-[var(--primary)] transition hover:bg-[var(--primary)] hover:text-white"
                    aria-label="Back"
                >
                    <ArrowLeft size={16} strokeWidth={2.2} />
                </button>

                <div className="min-w-0">
                    <div className="text-lg font-extrabold text-slate-900">
                        Edit User Profile
                    </div>
                    <div className="mt-1 text-sm text-slate-500">{data.titleLine}</div>
                </div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[340px_1fr]">
                <div className="space-y-5">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6">
                        <div className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">
                            Profile Photo
                        </div>

                        <div className="mt-4 flex flex-col items-center">
                            <div className="relative h-[160px] w-[160px] overflow-hidden rounded-full ring-1 ring-slate-200">
                                <Image
                                    src={data.avatarSrc}
                                    alt={data.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            <div className="mt-4 text-base font-extrabold text-slate-900">
                                {data.name}
                            </div>
                            <div className="mt-1 text-xs text-slate-500">
                                {data.credential}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6">
                        <div className="text-sm font-extrabold text-slate-900">
                            Account Status
                        </div>

                        <div className="mt-5 flex items-center justify-between gap-6">
                            <div>
                                <div className="text-base font-extrabold text-slate-900">
                                    Active Status
                                </div>
                                <div className="mt-1 text-sm font-semibold text-slate-500">
                                    Enable clinician access
                                </div>
                            </div>

                            <Switch
                                checked={accountActive}
                                onChange={setAccountActive}
                                ariaLabel="Active Status"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6">
                        <div className="text-base font-extrabold text-slate-900">
                            Personal Information
                        </div>

                        <div className="mt-5 grid gap-5 md:grid-cols-2">
                            <ReadOnlyField label="First Name" value={firstName} />
                            <ReadOnlyField label="Last Name" value={lastName} />
                            <ReadOnlyField label="Email Address" value={email} />
                            <ReadOnlyField label="Phone Number" value={phone} />
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6">
                        <div className="text-base font-extrabold text-slate-900">
                            Clinical Profile
                        </div>

                        <div className="mt-5 grid gap-5 md:grid-cols-2">
                            <ReadOnlyField label="Clinical Role" value={clinicalRole} />
                            <ReadOnlyField
                                label="Medical Designation"
                                value={medicalDesignation}
                            />
                            <ReadOnlyField label="Institution" value={institution} />
                            <ReadOnlyField label="NPI Number" value={npiNumber} />
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6">
                        <div className="text-base font-extrabold text-slate-900">
                            Internal Notes
                        </div>

                        <textarea
                            value={internalNotes}
                            onChange={(e) => setInternalNotes(e.target.value)}
                            placeholder="Add private administrative notes here... (e.g., verification follow-ups, disciplinary notes)"
                            className="mt-4 h-[140px] w-full resize-none rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-slate-700 outline-none placeholder:text-amber-700/45 focus:border-[var(--primary)]/35"
                        />

                        <div className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-slate-500">
                            <span className="text-slate-400">🔒</span>
                            Only administrators can see these notes.
                        </div>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-6 left-0 right-0 z-50 px-6">
                <div className="mx-auto w-full max-w-[1180px]">
                    <div className="rounded-2xl border border-slate-200 bg-white/95 shadow-lg backdrop-blur">
                        <div className="px-6 py-4">
                            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                <div className="text-xs text-slate-500">
                                    {data.meta.bottomLastUpdatedText}
                                </div>

                                <div className="flex items-center justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={onDiscard}
                                        disabled={isSaving}
                                        className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs font-extrabold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        Discard Changes
                                    </button>

                                    <button
                                        type="button"
                                        onClick={onSave}
                                        disabled={isSaving}
                                        className="rounded-full bg-[var(--primary)] px-5 py-2.5 text-xs font-extrabold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {isSaving ? "Saving..." : "Save Profile"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ProfileUpdatedModal
                open={openSuccess}
                profileName={data.name}
                roleText={data.role}
                lastUpdatedText="Just now"
                onClose={() => setOpenSuccess(false)}
                onDone={() => {
                    setOpenSuccess(false);
                    router.push(
                        `/dashboard/admin/users/${encodeURIComponent(data.id)}`
                    );
                }}
            />
        </div>
    );
}