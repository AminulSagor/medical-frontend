"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, Mail, Clock, Shield } from "lucide-react";
import { verifyOtp, sendOtp } from "@/service/public/auth/auth.service";

function VerifyOtpResetContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(299);
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `0${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleChange = (index: number, value: string) => {
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    setApiError(null);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setApiError("Please enter the complete 6-digit code.");
      return;
    }

    if (!email) {
      setApiError("Email not found. Please go back and try again.");
      return;
    }

    setSubmitting(true);
    setApiError(null);

    try {
      await verifyOtp({ email, otp: otpCode });
      // Redirect to set new password page with email
      router.push(`/public/auth/set-password?email=${encodeURIComponent(email)}`);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setApiError(
        axiosErr?.response?.data?.message ||
          "Verification failed. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!email || timeLeft > 0) return;

    setResending(true);
    setApiError(null);

    try {
      await sendOtp({ email });
      setOtp(["", "", "", "", "", ""]);
      setTimeLeft(299);
      inputRefs.current[0]?.focus();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setApiError(
        axiosErr?.response?.data?.message ||
          "Failed to resend code. Please try again.",
      );
    } finally {
      setResending(false);
    }
  };

  const canResend = timeLeft <= 0 && !resending;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center font-sans relative px-4">
      <div className="w-full max-w-md absolute top-8 left-0 right-0 mx-auto px-4">
        <button
          onClick={() => router.push("/public/auth/reset-password")}
          className="flex items-center text-slate-500 hover:text-slate-800 font-semibold text-sm transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" strokeWidth={3} />
          Back
        </button>
      </div>

      <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 sm:p-10 w-full max-w-md flex flex-col items-center text-center mt-12">
        <div className="bg-[#f0f9ff] w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
          <Mail className="w-8 h-8 text-[#38bdf8]" strokeWidth={2} />
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-3">
          Verify Your Email
        </h1>
        <p className="text-slate-500 text-sm leading-relaxed mb-8 px-2">
          A 6-digit code was sent to{" "}
          <span className="font-semibold text-slate-700">
            {email || "your email"}
          </span>
          . Enter it below to proceed with password reset.
        </p>

        <div className="flex justify-between w-full gap-2 sm:gap-3 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-14 sm:w-14 sm:h-16 border-2 border-slate-100 rounded-xl text-center text-xl font-bold text-slate-800 focus:border-[#38bdf8] focus:ring-1 focus:ring-[#38bdf8] outline-none transition-all placeholder:text-slate-300"
              placeholder="0"
            />
          ))}
        </div>

        <div className="bg-[#f8fafc] rounded-full px-5 py-2.5 flex items-center gap-2 mb-6">
          <Clock className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-500 tracking-wide uppercase">
            Code Expires In{" "}
            <span className="text-[#38bdf8]">{formatTime(timeLeft)}</span>
          </span>
        </div>

        {apiError && <p className="text-sm text-rose-600 mb-4">{apiError}</p>}

        <button
          onClick={handleVerify}
          disabled={submitting || otp.join("").length !== 6}
          className={[
            "w-full bg-[#38bdf8] hover:bg-[#0ea5e9] text-white font-bold text-base py-4 rounded-xl transition-colors shadow-lg shadow-sky-200 mb-6",
            (submitting || otp.join("").length !== 6) &&
              "opacity-60 cursor-not-allowed",
          ].join(" ")}
        >
          {submitting ? "Verifying..." : "Verify & Continue"}
        </button>

        <div className="text-sm font-medium text-slate-500">
          Didn&apos;t receive the code?{" "}
          <button
            onClick={handleResend}
            disabled={!canResend}
            className={[
              "text-[#38bdf8] hover:underline hover:text-[#0ea5e9]",
              !canResend && "opacity-50 cursor-not-allowed no-underline",
            ].join(" ")}
          >
            {resending ? "Sending..." : "Resend Code"}
          </button>
        </div>
      </div>

      <div className="mt-10 flex items-center gap-2 text-slate-400">
        <Shield className="w-4 h-4" strokeWidth={2} />
        <span className="text-xs font-bold tracking-[0.1em] uppercase">
          Secure Password Reset Portal
        </span>
      </div>
    </div>
  );
}

export default function VerifyOtpResetPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
          <div className="text-slate-500">Loading...</div>
        </div>
      }
    >
      <VerifyOtpResetContent />
    </Suspense>
  );
}
