"use client";

import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useSignUpController } from "./sign-up-controller";

function StrengthRow({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500">
      <span
        className={[
          "grid h-4 w-4 shrink-0 place-items-center rounded-full border text-[9px]",
          ok
            ? "border-emerald-400 bg-emerald-500 text-white"
            : "border-slate-300 bg-white text-slate-400",
        ].join(" ")}
      >
        {ok ? "✓" : "•"}
      </span>

      <span className={ok ? "text-emerald-700" : "text-slate-500"}>
        {label}
      </span>
    </div>
  );
}

export default function SignUpPage() {
  const c = useSignUpController();

  return (
    <div className="flex min-h-[calc(100dvh+4rem)] w-full items-center justify-center bg-slate-50 px-4 py-10">
      <div className="mx-auto w-full max-w-[420px]">
        <div className="rounded-[32px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
          <div className="px-5 pt-7 text-center">
            <h1 className="text-[22px] font-extrabold leading-7 tracking-tight text-slate-900">
              Create Professional Account
            </h1>

            <p className="mt-1 text-[13px] leading-5 text-slate-400">
              Establish your professional credentials to access
              <br />
              clinical simulations and training.
            </p>
          </div>

          <form onSubmit={c.onSubmit} className="space-y-3 px-5 pb-4 pt-5">
            <div>
              <label className="text-[11px] font-semibold text-slate-700">
                Full Legal Name
              </label>
              <input
                value={c.form.fullLegalName}
                onChange={(e) => c.setField("fullLegalName", e.target.value)}
                placeholder="Dr. Julian V. Sterling"
                className={[
                  "mt-1 h-10 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400",
                  "focus:border-sky-300 focus:ring-4 focus:ring-sky-100",
                  c.errors.fullLegalName
                    ? "border-rose-300"
                    : "border-slate-200",
                ].join(" ")}
              />
              {c.errors.fullLegalName && (
                <p className="mt-1 text-[11px] text-rose-600">
                  {c.errors.fullLegalName}
                </p>
              )}
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700">
                Medical Email Address
              </label>
              <input
                value={c.form.medicalEmail}
                onChange={(e) => c.setField("medicalEmail", e.target.value)}
                placeholder="j.sterling@hospital.org"
                type="email"
                className={[
                  "mt-1 h-10 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400",
                  "focus:border-sky-300 focus:ring-4 focus:ring-sky-100",
                  c.errors.medicalEmail
                    ? "border-rose-300"
                    : "border-slate-200",
                ].join(" ")}
              />
              {c.errors.medicalEmail && (
                <p className="mt-1 text-[11px] text-rose-600">
                  {c.errors.medicalEmail}
                </p>
              )}
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700">
                Professional Role
              </label>
              <input
                value={c.form.professionalRole}
                onChange={(e) => c.setField("professionalRole", e.target.value)}
                placeholder="e.g. Senior Anesthesiologist"
                className={[
                  "mt-1 h-10 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400",
                  "focus:border-sky-300 focus:ring-4 focus:ring-sky-100",
                  c.errors.professionalRole
                    ? "border-rose-300"
                    : "border-slate-200",
                ].join(" ")}
              />
              {c.errors.professionalRole && (
                <p className="mt-1 text-[11px] text-rose-600">
                  {c.errors.professionalRole}
                </p>
              )}
            </div>

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

              <div className="mt-3 grid gap-2 sm:grid-cols-2">
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

            {c.apiError && (
              <p className="text-center text-[12px] text-rose-600">
                {c.apiError}
              </p>
            )}

            <button
              type="submit"
              disabled={c.submitting}
              className="mt-1 h-10 w-full rounded-lg bg-[#32C4F3] text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {c.submitting ? "Creating..." : "Sign up"}
            </button>

            <div className="pt-1 text-center text-xs text-slate-600">
              Already have an account?{" "}
              <Link
                className="text-sky-600 hover:underline"
                href="/public/auth/sign-in"
              >
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}