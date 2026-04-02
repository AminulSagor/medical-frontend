// app/(auth)/reset-password/page.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Mail, SendHorizonal } from "lucide-react";
import { useState } from "react";
import { sendOtp } from "@/service/auth/auth.service";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await sendOtp({ email });
      // Redirect to OTP verification with email and mode=reset
      router.push(`/public/auth/verify-otp-reset?email=${encodeURIComponent(email)}`);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(
        axiosErr?.response?.data?.message || "Failed to send reset code. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-30">
      <div className="rounded-[34px] border border-slate-200 bg-white p-10 shadow-[0_18px_60px_rgba(15,23,42,0.10)]">
        {/* Back */}
        <Link
          href="/public/auth/sign-in"
          className="inline-flex items-center gap-2 text-sm font-semibold text-sky-600 hover:text-sky-700"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Login
        </Link>

        {/* Title */}
        <h1 className="mt-8 text-4xl font-bold tracking-tight text-slate-900">
          Reset Your Password
        </h1>

        <p className="mt-4 max-w-lg text-base leading-7 text-slate-500">
          Enter the email address associated with your clinical account. We will
          send you a verification code to reset your password.
        </p>

        {/* Form */}
        <form onSubmit={onSubmit} className="mt-10 space-y-6">
          <div>
            <label className="text-xs font-semibold tracking-widest text-slate-400">
              EMAIL ADDRESS
            </label>

            <div className="relative mt-3">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                type="email"
                placeholder="doctor@clinic.org"
                className={[
                  "h-14 w-full rounded-2xl border bg-white pl-12 pr-4 text-base text-slate-900 outline-none",
                  error ? "border-rose-300" : "border-slate-200 placeholder:text-slate-300",
                  "focus:border-sky-300 focus:ring-4 focus:ring-sky-100",
                ].join(" ")}
              />
            </div>

            {error && (
              <p className="mt-2 text-sm text-rose-600">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={[
              "mt-2 inline-flex h-14 w-full items-center justify-center gap-3 rounded-2xl",
              "bg-sky-500 text-base font-semibold text-white",
              "shadow-[0_14px_35px_rgba(2,132,199,0.28)] hover:bg-sky-600",
              "focus:outline-none focus:ring-4 focus:ring-sky-200",
              submitting && "opacity-60 cursor-not-allowed",
            ].join(" ")}
          >
            {submitting ? "Sending..." : "Send Verification Code"}
            <SendHorizonal className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
