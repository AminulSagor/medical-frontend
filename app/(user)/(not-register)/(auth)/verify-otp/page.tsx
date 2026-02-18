"use client";

import { Mail } from "lucide-react";
import { useVerifyOtpController } from "./verify-otp-controller";

export default function VerifyOtpPage() {
  const c = useVerifyOtpController({
    onVerify: async (code) => {
      // TODO: call your verify otp API
      // await verifyOtp({ code });
      await new Promise((r) => setTimeout(r, 800));
      alert(`Submitted OTP: ${code}`);
    },
    onResend: async () => {
      // TODO: call resend API
      await new Promise((r) => setTimeout(r, 400));
    },
  });

  return (
    <div className="mx-auto w-full max-w-md px-4 py-10">
      <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_18px_60px_rgba(15,23,42,0.10)]">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-sky-50 ring-1 ring-sky-100">
          <Mail className="h-6 w-6 text-sky-600" />
        </div>

        <h1 className="mt-5 text-center text-2xl font-semibold text-slate-900">
          Verify Your Identity
        </h1>

        <p className="mx-auto mt-2 max-w-sm text-center text-sm leading-6 text-slate-500">
          A 6-digit code was sent to your email. Enter it below to finalize your
          account and proceed to seat selection.
        </p>

        <form onSubmit={c.submit} className="mt-6">
          <div className="flex justify-center gap-3">
            {Array.from({ length: c.otpLen }).map((_, i) => (
              <input
                key={i}
                ref={(el) => {
                  c.inputsRef.current[i] = el;
                }}
                inputMode="numeric"
                autoComplete="one-time-code"
                aria-label={`OTP digit ${i + 1}`}
                value={c.otp[i]}
                onChange={(e) => c.onChange(i, e.target.value)}
                onKeyDown={(e) => c.onKeyDown(i, e)}
                onPaste={(e) => {
                  e.preventDefault();
                  c.onPaste(i, e.clipboardData.getData("text"));
                }}
                className={[
                  "h-14 w-12 rounded-2xl border bg-white text-center text-lg font-semibold outline-none",
                  "transition",
                  "border-slate-200 text-slate-900",
                  "focus:border-sky-300 focus:ring-4 focus:ring-sky-100",
                ].join(" ")}
              />
            ))}
          </div>

          <div className="mt-5 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-[11px] font-medium tracking-wide text-slate-600">
              <span className="inline-block h-2 w-2 rounded-full bg-slate-300" />
              <span>CODE EXPIRES IN</span>
              <span className="font-semibold text-sky-600">{c.timeText}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={!c.canSubmit || c.submitting}
            className={[
              "mt-6 h-12 w-full rounded-2xl text-sm font-semibold text-white shadow-[0_12px_30px_rgba(2,132,199,0.25)]",
              "bg-sky-500 hover:bg-sky-600",
              "focus:outline-none focus:ring-4 focus:ring-sky-200",
              (!c.canSubmit || c.submitting) && "cursor-not-allowed opacity-60",
            ].join(" ")}
          >
            {c.submitting ? "Verifying..." : "Verify & Login To account"}
          </button>

          <div className="mt-5 text-center text-xs text-slate-500">
            Didn&apos;t receive the code?{" "}
            <button
              type="button"
              onClick={c.resend}
              disabled={!c.canResend}
              className={[
                "font-semibold text-sky-600 hover:underline",
                !c.canResend && "cursor-not-allowed text-slate-400 no-underline",
              ].join(" ")}
            >
              Resend Code
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
