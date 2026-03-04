"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, FileText } from "lucide-react";
import ProfileUpdatedModal from "../_components/profile-updated-modal";

type UserRole = "Student" | "Instructor" | "Admin";

type ReadonlyUserProfile = {
    id: string;
    role: "Student" | "Instructor";
    name: string;
    titleLine: string; // small subtitle line under name
    email: string;
    phone: string;
    credential: string; // CRNA Student / Anesthesiologist etc.
    institution: string;
    npi?: string;
    joined: string;
    avatarSrc: string;

    // ✅ editable only
    accountActive: boolean;
    internalNotes: string;

    meta: {
        bottomLastUpdatedText: string;
    };
};

/** Simple local mock (replace with API later) */
const MOCK_EDIT: Record<string, ReadonlyUserProfile> = {
    u1: {
        id: "u1",
        role: "Instructor",
        name: "Dr. Sarah Jenkins",
        titleLine: "Update clinician details and account status",
        email: "sjenkins@institute.edu",
        phone: "+1 (555) 012-3456",
        credential: "Anesthesiologist",
        institution: "Texas Medical Center",
        npi: "1092837465",
        joined: "Oct 12, 2023",
        avatarSrc: "/photos/image.png",
        accountActive: true,
        internalNotes:
            "Highly recommended for complex pediatric simulations.\n\nAvailable for extra shifts during Q3 training window 2026.\nCertified for Level 4 airway equipment maintenance.",
        meta: { bottomLastUpdatedText: "Last updated: Oct 24, 2023 by Admin J. Doe" },
    },
    u2: {
        id: "u2",
        role: "Student",
        name: "Marcus Thome",
        titleLine: "Update student account status",
        email: "mthome@institute.edu",
        phone: "+1 (555) 012-3456",
        credential: "CRNA Student",
        institution: "Houston Medical Center",
        joined: "Nov 01, 2023",
        avatarSrc: "/photos/image.png",
        accountActive: true,
        internalNotes: "",
        meta: { bottomLastUpdatedText: "Last updated: Oct 24, 2023 by Admin J. Doe" },
    },
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
    const searchParams = useSearchParams();
    const params = useParams<{ id: string }>();
    const id = typeof params?.id === "string" ? params.id : "";
    const [openSuccess, setOpenSuccess] = useState(false);

    const data = useMemo<ReadonlyUserProfile | null>(() => {
        const key = decodeURIComponent(id || "");
        if (MOCK_EDIT[key]) return MOCK_EDIT[key];

        const role = (searchParams.get("role") as UserRole | null) ?? null;
        if (role !== "Student" && role !== "Instructor") return null;

        const name = searchParams.get("name") ?? "";
        const credential = searchParams.get("credential") ?? "";
        const email = searchParams.get("email") ?? "";
        const phone = searchParams.get("phone") ?? "";
        const joined = searchParams.get("joined") ?? "—";

        if (!name) return null;

        return {
            id: key,
            role,
            name,
            titleLine: "Update clinician details and account status",
            email,
            phone: phone || "+1 (555) 012-3456",
            credential: credential || role,
            institution: role === "Student" ? "Houston Medical Center" : "Texas Medical Center",
            npi: role === "Instructor" ? "1092837465" : undefined,
            joined,
            avatarSrc: "/photos/image.png",
            accountActive: true,
            internalNotes: "",
            meta: { bottomLastUpdatedText: `Last updated: ${joined} by Admin` },
        };
    }, [id, searchParams]);

    // ✅ Only editable fields
    const [accountActive, setAccountActive] = useState(false);
    const [internalNotes, setInternalNotes] = useState("");

    useEffect(() => {
        if (!data) return;
        setAccountActive(data.accountActive);
        setInternalNotes(data.internalNotes);
    }, [data]);

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
                        onClick={() => router.push("/users")}
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

    const onSave = () => {
        console.log("save", { id: data.id, accountActive, internalNotes });
        setOpenSuccess(true);
    };

    const fullName = data.name ?? "";
    const parts = fullName.trim().split(/\s+/).filter(Boolean);
    const firstName = parts[0] ?? "";
    const lastName = parts.slice(1).join(" ");
    // ✅ read-only values (use data)
    const email = data.email ?? "";
    const phone = data.phone ?? "";

    // ✅ clinical profile values (use data)
    const clinicalRole = data.role; // Student / Instructor (as per your type)
    const medicalDesignation = data.credential ?? "";
    const institution = data.institution ?? "";
    const npiNumber = data.npi ?? "—";

    return (
        <div className="mx-auto w-full max-w-[1180px] pt-6 pb-24">
            {/* header */}
            <div className="flex items-start gap-3">
                <button
                    type="button"
                    onClick={() => router.push(`/users/${encodeURIComponent(data.id)}`)}
                    className="grid h-9 w-9 place-items-center rounded-full border border-[var(--primary)]/20 bg-[var(--primary-50)] text-[var(--primary)] transition hover:bg-[var(--primary)] hover:text-white"
                    aria-label="Back"
                >
                    <ArrowLeft size={16} strokeWidth={2.2} />
                </button>

                <div className="min-w-0">
                    <div className="text-lg font-extrabold text-slate-900">Edit User Profile</div>
                    <div className="mt-1 text-sm text-slate-500">{data.titleLine}</div>
                </div>
            </div>

            {/* grid */}
            <div className="mt-6 grid gap-6 lg:grid-cols-[340px_1fr]">
                {/* left */}
                <div className="space-y-5">
                    {/* profile photo (read-only) */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6">
                        <div className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">
                            Profile Photo
                        </div>

                        <div className="mt-4 flex flex-col items-center">
                            <div className="relative h-[160px] w-[160px] overflow-hidden rounded-full ring-1 ring-slate-200">
                                <Image src={data.avatarSrc} alt={data.name} fill className="object-cover" />
                            </div>

                            <div className="mt-4 text-base font-extrabold text-slate-900">{data.name}</div>
                            <div className="mt-1 text-xs text-slate-500">{data.credential}</div>
                        </div>
                    </div>

                    {/* ✅ account status (editable) */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6">
                        <div className="text-sm font-extrabold text-slate-900">Account Status</div>

                        <div className="mt-5 flex items-center justify-between gap-6">
                            <div>
                                <div className="text-base font-extrabold text-slate-900">Active Status</div>
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

                {/* right */}
                <div className="space-y-6">
                    {/* personal information (read-only) */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6">
                        <div className="text-base font-extrabold text-slate-900">Personal Information</div>

                        <div className="mt-5 grid gap-5 md:grid-cols-2">
                            <ReadOnlyField label="First Name" value={firstName} />
                            <ReadOnlyField label="Last Name" value={lastName} />
                            <ReadOnlyField label="Email Address" value={email} />
                            <ReadOnlyField label="Phone Number" value={phone} />
                        </div>
                    </div>

                    {/* clinical profile (read-only) */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6">
                        <div className="text-base font-extrabold text-slate-900">Clinical Profile</div>

                        <div className="mt-5 grid gap-5 md:grid-cols-2">
                            <ReadOnlyField label="Clinical Role" value={clinicalRole} />
                            <ReadOnlyField label="Medical Designation" value={medicalDesignation} />
                            <ReadOnlyField label="Institution" value={institution} />
                            <ReadOnlyField label="NPI Number" value={npiNumber} />
                        </div>
                    </div>

                    {/* ✅ internal notes (editable) */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6">
                        {/* Title (same size as Clinical Profile) */}
                        <div className="text-base font-extrabold text-slate-900">Internal Notes</div>

                        {/* Yellow note box like screenshot 1 */}
                        <textarea
                            value={internalNotes}
                            onChange={(e) => setInternalNotes(e.target.value)}
                            placeholder="Add private administrative notes here... (e.g., verification follow-ups, disciplinary notes)"
                            className="mt-4 h-[140px] w-full resize-none rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-slate-700 outline-none placeholder:text-amber-700/45 focus:border-[var(--primary)]/35"
                        />

                        {/* Text BELOW the box */}
                        <div className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-slate-500">
                            <span className="text-slate-400">🔒</span>
                            Only administrators can see these notes.
                        </div>
                    </div>
                </div>
            </div>

            {/* bottom bar */}
            <div className="fixed bottom-6 left-0 right-0 z-50 px-6">
                <div className="mx-auto w-full max-w-[1180px]">
                    <div className="rounded-2xl border border-slate-200 bg-white/95 shadow-lg backdrop-blur">
                        <div className="px-6 py-4">
                            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                <div className="text-xs text-slate-500">{data.meta.bottomLastUpdatedText}</div>

                                <div className="flex items-center justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={onDiscard}
                                        className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs font-extrabold text-slate-700 transition hover:bg-slate-100"
                                    >
                                        Discard Changes
                                    </button>

                                    <button
                                        type="button"
                                        onClick={onSave}
                                        className="rounded-full bg-[var(--primary)] px-5 py-2.5 text-xs font-extrabold text-white transition hover:brightness-95"
                                    >
                                        Save Profile
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
                    router.push(`/users/${encodeURIComponent(data.id)}`);
                }}
            />
        </div>
    );
}