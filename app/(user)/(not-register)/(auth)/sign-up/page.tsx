"use client";

import Link from "next/link";

import { Eye, EyeOff } from "lucide-react";
import { useSignUpController } from "./sign-up-controller";


function StrengthRow({ ok, label }: { ok: boolean; label: string }) {
    return (
        <div className="flex items-center gap-2 text-[11px] leading-4">
            <span
                className={[
                    "grid h-4 w-4 place-items-center rounded-full border",
                    ok
                        ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 bg-white text-slate-400",
                ].join(" ")}
            >
                {ok ? "✓" : "•"}
            </span>
            <span className={ok ? "text-slate-700" : "text-slate-500"}>{label}</span>
        </div>
    );
}

export default function SignUpPage() {
    const c = useSignUpController();

    return (
        <div className="min-h-screen w-full bg-slate-50 px-4 -py-10 ">
            <div className="mx-auto w-full max-w-[420px]">
                {/* compact "FB-like" header */}
                <div className="mb-4 pt-12 flex flex-col items-center">

                 



                    <div className="flex flex-col items-center text-center">
                        <h1 className="text-[22px] font-extrabold leading-7 tracking-tight text-slate-900">
                            Create Professional Account
                        </h1>

                        <p className="mt-1 max-w-[360px] text-[13px] leading-5 text-slate-400">
                            Establish your professional credentials to access
                            <br />
                            clinical simulations and training.
                        </p>
                    </div>

                </div>

                {/* smaller card */}
                <div className="rounded-xl border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.08)]">

                    <form onSubmit={c.onSubmit} className="space-y-3 px-5 py-4">
                        {/* Full Name */}
                        <div>
                            <label className="text-[11px] font-semibold text-slate-700">
                                Full Legal Name
                            </label>
                            <input
                                value={c.form.fullName}
                                onChange={(e) => c.setField("fullName", e.target.value)}
                                placeholder="Dr. Julian V. Sterling"
                                className={[
                                    "mt-1 h-10 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400",
                                    "focus:border-sky-300 focus:ring-4 focus:ring-sky-100",
                                    c.errors.fullName ? "border-rose-300" : "border-slate-200",
                                ].join(" ")}
                            />
                            {c.errors.fullName && (
                                <p className="mt-1 text-[11px] text-rose-600">
                                    {c.errors.fullName}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="text-[11px] font-semibold text-slate-700">
                                Medical Email Address
                            </label>
                            <input
                                value={c.form.email}
                                onChange={(e) => c.setField("email", e.target.value)}
                                placeholder="j.sterling@hospital.org"
                                type="email"
                                className={[
                                    "mt-1 h-10 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400",
                                    "focus:border-sky-300 focus:ring-4 focus:ring-sky-100",
                                    c.errors.email ? "border-rose-300" : "border-slate-200",
                                ].join(" ")}
                            />
                            {c.errors.email && (
                                <p className="mt-1 text-[11px] text-rose-600">{c.errors.email}</p>
                            )}
                        </div>

                        {/* Role */}
                        <div>
                            <label className="text-[11px] font-semibold text-slate-700">
                                Professional Role
                            </label>
                            <input
                                value={c.form.role}
                                onChange={(e) => c.setField("role", e.target.value)}
                                placeholder="e.g. Senior Anesthesiologist"
                                className={[
                                    "mt-1 h-10 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400",
                                    "focus:border-sky-300 focus:ring-4 focus:ring-sky-100",
                                    c.errors.role ? "border-rose-300" : "border-slate-200",
                                ].join(" ")}
                            />
                            {c.errors.role && (
                                <p className="mt-1 text-[11px] text-rose-600">{c.errors.role}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="text-[11px] font-semibold text-slate-700">
                                New Password
                            </label>

                            <div className="relative mt-1">
                                <input
                                    value={c.form.password}
                                    onChange={(e) => c.setField("password", e.target.value)}
                                    placeholder="New password"
                                    type={c.showPassword ? "text" : "password"}
                                    className={[
                                        "h-10 w-full rounded-lg border bg-white px-3 pr-12 text-sm text-slate-900 caret-slate-900 outline-none placeholder:text-slate-400",
                                        "focus:border-sky-300 focus:ring-4 focus:ring-sky-100",
                                        c.errors.password ? "border-rose-300" : "border-slate-200",
                                    ].join(" ")}
                                />
                                <button
                                    type="button"
                                    onClick={c.toggleShowPassword}
                                    aria-label={c.showPassword ? "Hide password" : "Show password"}
                                    className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md p-2 text-slate-500 hover:bg-slate-100 focus:outline-none"
                                >
                                    {c.showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>

                            <div className="mt-2 grid gap-2 sm:grid-cols-2">
                                <StrengthRow ok={c.strength.len} label="12+ characters" />
                                <StrengthRow
                                    ok={c.strength.upper && c.strength.lower}
                                    label="Upper + lower"
                                />
                                <StrengthRow ok={c.strength.number} label="Number" />
                                <StrengthRow ok={c.strength.symbol} label="Symbol" />
                            </div>

                            {c.errors.password && (
                                <p className="mt-1 text-[11px] text-rose-600">
                                    {c.errors.password}
                                </p>
                            )}
                        </div>

                        {/* Terms */}
                        <div className="pt-1">
                            <label className="flex cursor-pointer items-start gap-2">
                                <input
                                    checked={c.form.acceptedTerms}
                                    onChange={(e) => c.setField("acceptedTerms", e.target.checked)}
                                    type="checkbox"
                                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-200"
                                />
                                <span className="text-[11px] leading-4 text-slate-600">
                                    I agree to the{" "}
                                    <Link className="text-sky-600 hover:underline" href="#">
                                        Terms of Service
                                    </Link>{" "}
                                    and{" "}
                                    <Link className="text-sky-600 hover:underline" href="#">
                                        Medical Data Usage Policy
                                    </Link>
                                    .
                                </span>
                            </label>
                            {c.errors.acceptedTerms && (
                                <p className="mt-1 text-[11px] text-rose-600">
                                    {c.errors.acceptedTerms}
                                </p>
                            )}
                        </div>

                        {/* CTA */}
                        <button
                            type="submit"
                            disabled={c.submitting}
                            className="mt-1 h-10 w-full rounded-lg bg-[#32C4F3]
 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {c.submitting ? "Creating..." : "Sign up"}
                        </button>

                        <div className="pt-1 text-center text-xs text-slate-600">
                            Already have an account?{" "}
                            <Link className="text-sky-600 hover:underline" href="/sign-in">
                                Sign in
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
