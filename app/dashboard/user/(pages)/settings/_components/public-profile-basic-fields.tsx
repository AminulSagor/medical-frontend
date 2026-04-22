"use client";

import { Mail } from "lucide-react";
import type { AccountProfile } from "@/types/user/account-settings/account-settings-type";

function cx(...v: Array<string | false | null | undefined>) {
    return v.filter(Boolean).join(" ");
}

type Props = {
    form: AccountProfile;
    errors: Record<string, string>;
    onFieldChange: <K extends keyof AccountProfile>(
        key: K,
        value: AccountProfile[K],
    ) => void;
};

export default function PublicProfileBasicFields({
    form,
    errors,
    onFieldChange,
}: Props) {
    return (
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
                <label className="text-[12px] font-semibold text-slate-700">
                    First Name
                </label>
                <input
                    value={form.firstName}
                    onChange={(e) => onFieldChange("firstName", e.target.value)}
                    className={cx(
                        "mt-2 h-11 w-full rounded-xl border bg-white px-4 text-[13px] text-slate-900 outline-none",
                        errors.firstName
                            ? "border-rose-300 ring-4 ring-rose-50"
                            : "border-slate-200 focus:ring-4 focus:ring-sky-100",
                    )}
                />
                {errors.firstName ? (
                    <div className="mt-1 text-[11px] text-rose-600">
                        {errors.firstName}
                    </div>
                ) : null}
            </div>

            <div>
                <label className="text-[12px] font-semibold text-slate-700">
                    Last Name
                </label>
                <input
                    value={form.lastName}
                    onChange={(e) => onFieldChange("lastName", e.target.value)}
                    className={cx(
                        "mt-2 h-11 w-full rounded-xl border bg-white px-4 text-[13px] text-slate-900 outline-none",
                        errors.lastName
                            ? "border-rose-300 ring-4 ring-rose-50"
                            : "border-slate-200 focus:ring-4 focus:ring-sky-100",
                    )}
                />
                {errors.lastName ? (
                    <div className="mt-1 text-[11px] text-rose-600">
                        {errors.lastName}
                    </div>
                ) : null}
            </div>

            <div>
                <label className="text-[12px] font-semibold text-slate-700">
                    Email Address
                </label>
                <div className="mt-2 flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <input
                        value={form.email}
                        readOnly
                        className="w-full bg-transparent text-[13px] text-slate-500 outline-none"
                    />
                </div>
            </div>

            <div>
                <label className="text-[12px] font-semibold text-slate-700">
                    Phone Number
                </label>
                <input
                    value={form.phone}
                    onChange={(e) => onFieldChange("phone", e.target.value)}
                    className={cx(
                        "mt-2 h-11 w-full rounded-xl border bg-white px-4 text-[13px] text-slate-900 outline-none",
                        errors.phone
                            ? "border-rose-300 ring-4 ring-rose-50"
                            : "border-slate-200 focus:ring-4 focus:ring-sky-100",
                    )}
                />
                {errors.phone ? (
                    <div className="mt-1 text-[11px] text-rose-600">{errors.phone}</div>
                ) : null}
            </div>
        </div>
    );
}