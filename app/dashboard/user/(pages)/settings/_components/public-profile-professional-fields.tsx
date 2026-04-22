"use client";

import { ChevronDown } from "lucide-react";

function cx(...v: Array<string | false | null | undefined>) {
    return v.filter(Boolean).join(" ");
}

type Props = {
    titleRole: string;
    institution: string;
    npiNumber: string;
    errors: Record<string, string>;
    titleRoleOptions: readonly string[];
    onTitleRoleChange: (value: string) => void;
    onInstitutionChange: (value: string) => void;
    onNpiNumberChange: (value: string) => void;
};

export default function PublicProfileProfessionalFields({
    titleRole,
    institution,
    npiNumber,
    errors,
    titleRoleOptions,
    onTitleRoleChange,
    onInstitutionChange,
    onNpiNumberChange,
}: Props) {
    return (
        <div>
            <div className="text-[14px] font-semibold text-slate-900">
                Professional Details
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                    <label className="text-[12px] font-semibold text-slate-700">
                        Title / Role
                    </label>
                    <div className="relative mt-2">
                        <select
                            value={titleRole}
                            onChange={(e) => onTitleRoleChange(e.target.value)}
                            className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-[13px] text-slate-900 outline-none focus:ring-4 focus:ring-sky-100"
                        >
                            <option value="">Select title / role</option>
                            {titleRoleOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    </div>
                </div>

                <div>
                    <label className="text-[12px] font-semibold text-slate-700">
                        Institution / Hospital{" "}
                        <span className="text-slate-400">(Optional)</span>
                    </label>
                    <input
                        value={institution}
                        onChange={(e) => onInstitutionChange(e.target.value)}
                        className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:ring-4 focus:ring-sky-100"
                    />
                </div>

                <div>
                    <label className="text-[12px] font-semibold text-slate-700">
                        NPI Number <span className="text-slate-400">(Optional)</span>
                    </label>
                    <input
                        value={npiNumber}
                        onChange={(e) => onNpiNumberChange(e.target.value)}
                        placeholder="10-digit number"
                        className={cx(
                            "mt-2 h-11 w-full rounded-xl border bg-white px-4 text-[13px] text-slate-900 outline-none",
                            errors.npiNumber
                                ? "border-rose-300 ring-4 ring-rose-50"
                                : "border-slate-200 focus:ring-4 focus:ring-sky-100",
                        )}
                    />
                    {errors.npiNumber ? (
                        <div className="mt-1 text-[11px] text-rose-600">
                            {errors.npiNumber}
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}