"use client";

import { Camera, Plus, AtSign, User } from "lucide-react";

export type AccountDetailsValue = {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
};

type Props = {
    value: AccountDetailsValue;
    onChange: (patch: Partial<AccountDetailsValue>) => void;

    photoUrl?: string | null;
    onOpenPhotoModal?: () => void;
};

export default function AccountDetailsCard({
    value,
    onChange,
    photoUrl,
    onOpenPhotoModal,
}: Props) {
    return (
        <div
            className={[
                "rounded-2xl bg-white p-6 ring-1 ring-slate-200",
                "shadow-[0_18px_45px_rgba(15,23,42,0.10)]",
            ].join(" ")}
        >
            {/* header */}
            <div className="mb-6 flex items-center gap-2">
                <User size={18} className="text-[var(--primary)]" />
                <div>
                    <h2 className="text-lg font-extrabold text-slate-900">Account Details</h2>
                    <p className="text-xs text-slate-500">Profile photo & basic identity.</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-[220px_1fr]">
                {/* left: photo */}
                <div className="relative">
                    <div className="text-[11px] font-bold tracking-wide text-slate-600">PROFILE PHOTO</div>

                    <div className="mt-3 flex items-center gap-4">
                        <div className="relative">
                            <button
                                type="button"
                                onClick={onOpenPhotoModal}
                                className={[
                                    "group grid h-[118px] w-[118px] place-items-center rounded-full overflow-hidden",
                                    "border-[2.5px] border-dashed border-slate-400/70",
                                    "bg-slate-100/60",
                                    "transition hover:border-[var(--primary)]/50",
                                ].join(" ")}
                                aria-label="Add profile photo"
                            >
                                {photoUrl ? (
                                    <img src={photoUrl} alt="Profile" className="h-full w-full object-cover" />
                                ) : (
                                    <div className="flex flex-col items-center gap-2">
                                        <div
                                            className={[
                                                "grid h-11 w-11 place-items-center rounded-2xl",
                                                "bg-slate-100 text-slate-600",
                                                "ring-1 ring-slate-200",
                                            ].join(" ")}
                                        >
                                            <Camera size={20} />
                                        </div>
                                        <div className="text-[11px] font-semibold text-[var(--primary)]">
                                            + ADD PHOTO
                                        </div>
                                    </div>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={onOpenPhotoModal}
                                className="absolute -right-1 -bottom-1 grid h-10 w-10 place-items-center rounded-full bg-[var(--primary)] text-white shadow-md transition hover:bg-[var(--primary-hover)] active:scale-95"
                                aria-label="Add"
                            >
                                <Plus size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* right: fields */}
                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <label className="text-[11px] font-bold tracking-wide text-slate-600">
                            FIRST NAME
                        </label>
                        <input
                            value={value.firstName}
                            onChange={(e) => onChange({ firstName: e.target.value })}
                            className={[
                                "mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm",
                                "text-slate-900 placeholder:text-slate-400",
                                "outline-none transition",
                                "focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15",
                            ].join(" ")}
                            placeholder="Jonathan"
                        />
                    </div>

                    <div>
                        <label className="text-[11px] font-bold tracking-wide text-slate-600">
                            LAST NAME
                        </label>
                        <input
                            value={value.lastName}
                            onChange={(e) => onChange({ lastName: e.target.value })}
                            className={[
                                "mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm",
                                "text-slate-900 placeholder:text-slate-400",
                                "outline-none transition",
                                "focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15",
                            ].join(" ")}
                            placeholder="Miller"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="text-[11px] font-bold tracking-wide text-slate-600">
                            PHONE NUMBER
                        </label>
                        <input
                            value={value.phoneNumber}
                            onChange={(e) => {
                                // Allow digits, +, -, space, ( )
                                const cleaned = e.target.value.replace(/[^0-9+\- ()]/g, "");
                                onChange({ phoneNumber: cleaned });
                            }}
                            inputMode="tel"
                            className={[
                                "mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm",
                                "text-slate-900 placeholder:text-slate-400",
                                "outline-none transition",
                                "focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15",
                            ].join(" ")}
                            placeholder="+1 (555) 000-0000"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="text-[11px] font-bold tracking-wide text-slate-600">
                            EMAIL ADDRESS
                        </label>

                        <div
                            className={[
                                "mt-2 flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5",
                                "focus-within:border-[var(--primary)] focus-within:ring-2 focus-within:ring-[var(--primary)]/15",
                            ].join(" ")}
                        >
                            <AtSign size={16} className="text-slate-500" />
                            <input
                                value={value.email}
                                onChange={(e) => onChange({ email: e.target.value })}
                                className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                                placeholder="j.miller@tai.edu"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}