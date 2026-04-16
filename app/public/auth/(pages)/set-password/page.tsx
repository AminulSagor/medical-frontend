// app/(auth)/set-new-password/page.tsx
"use client";

import Link from "next/link";
import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, Eye, EyeOff, Lock, ShieldCheck } from "lucide-react";
import { resetPassword } from "@/service/public/auth/auth.service";

function SetNewPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const rules = useMemo(() => {
    const lenOk = password.length >= 8;
    const numberOrSpecial = /[\d\W]/.test(password);
    return { lenOk, numberOrSpecial };
  }, [password]);

  const canSubmit =
    password.length > 0 &&
    confirm.length > 0 &&
    password === confirm &&
    rules.lenOk &&
    rules.numberOrSpecial &&
    !submitting;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    if (!email) {
      setApiError(
        "Email not found. Please restart the password reset process.",
      );
      return;
    }

    setSubmitting(true);
    setApiError(null);

    try {
      await resetPassword({
        email,
        password,
        forgetPassword: true,
      });
      // Redirect to sign-in with success message
      router.push("/public/auth/sign-in?reset=success");
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setApiError(
        axiosErr?.response?.data?.message ||
          "Failed to reset password. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100dvh+4rem)] w-full items-center justify-center px-4 py-10">
      <div className="mx-auto w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-7 shadow-[0_16px_50px_rgba(15,23,42,0.10)]">
        {/* Back */}
        <Link
          href="/public/auth/reset-password"
          className="inline-flex items-center gap-2 text-sm font-semibold text-sky-600 hover:text-sky-700"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to reset password
        </Link>

        <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">
          Set New Password
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          Your code has been verified. Choose a new, strong password to secure
          your clinical account.
        </p>

        <form onSubmit={onSubmit} className="mt-7 space-y-5">
          {/* New Password */}
          <div>
            <label className="text-sm font-semibold text-slate-700">
              New Password
            </label>

            <div className="relative mt-2">
              <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPass ? "text" : "password"}
                placeholder="Enter new password"
                className={[
                  "h-12 w-full rounded-2xl border bg-white pl-12 pr-12 text-sm text-slate-900 outline-none",
                  "border-slate-200 placeholder:text-slate-400",
                  "focus:border-sky-300 focus:ring-4 focus:ring-sky-100",
                ].join(" ")}
              />

              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                aria-label={showPass ? "Hide password" : "Show password"}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl p-2 text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-sky-100"
              >
                {showPass ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm */}
          <div>
            <label className="text-sm font-semibold text-slate-700">
              Confirm New Password
            </label>

            <div className="relative mt-2">
              <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm new password"
                className={[
                  "h-12 w-full rounded-2xl border bg-white pl-12 pr-12 text-sm text-slate-900 outline-none",
                  "border-slate-200 placeholder:text-slate-400",
                  "focus:border-sky-300 focus:ring-4 focus:ring-sky-100",
                ].join(" ")}
              />

              <button
                type="button"
                onClick={() => setShowConfirm((s) => !s)}
                aria-label={showConfirm ? "Hide password" : "Show password"}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl p-2 text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-sky-100"
              >
                {showConfirm ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            {confirm.length > 0 && password !== confirm && (
              <p className="mt-2 text-xs text-rose-600">
                Passwords do not match.
              </p>
            )}
          </div>

          {/* Requirements */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-[11px] font-semibold tracking-widest text-slate-500">
              PASSWORD REQUIREMENTS
            </div>

            <div className="mt-3 space-y-3 text-sm">
              <ReqRow ok={rules.lenOk} label="At least 8 characters" />
              <ReqRow
                ok={rules.numberOrSpecial}
                label="Include a number or special character"
              />
            </div>
          </div>

          {/* API Error */}
          {apiError && (
            <p className="text-sm text-rose-600 text-center">{apiError}</p>
          )}

          {/* CTA */}
          <button
            type="submit"
            disabled={!canSubmit}
            className={[
              "mt-1 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl",
              "bg-sky-500 text-sm font-semibold text-white",
              "shadow-[0_14px_35px_rgba(2,132,199,0.28)] hover:bg-sky-600",
              "focus:outline-none focus:ring-4 focus:ring-sky-200",
              !canSubmit && "cursor-not-allowed opacity-60",
            ].join(" ")}
          >
            {submitting ? "Updating..." : "Update Password"}{" "}
            <ShieldCheck className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default function SetNewPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
          <div className="text-slate-500">Loading...</div>
        </div>
      }
    >
      <SetNewPasswordContent />
    </Suspense>
  );
}

function ReqRow({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={[
          "grid h-6 w-6 place-items-center rounded-full border",
          ok
            ? "border-emerald-200 bg-emerald-50 text-emerald-600"
            : "border-slate-200 bg-white text-slate-400",
        ].join(" ")}
      >
        {ok ? "✓" : "•"}
      </span>
      <span className={ok ? "text-slate-700" : "text-slate-500"}>{label}</span>
    </div>
  );
}
