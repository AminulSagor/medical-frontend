"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type UseVerifyOtpControllerOptions = {
  otpLen?: number;
  defaultSeconds?: number;
  onVerify?: (code: string) => Promise<void> | void;
  onResend?: () => Promise<void> | void;
};

export function useVerifyOtpController(options?: UseVerifyOtpControllerOptions) {
  const otpLen = options?.otpLen ?? 6;
  const defaultSeconds = options?.defaultSeconds ?? 5 * 60;

  const [otp, setOtp] = useState<string[]>(Array(otpLen).fill(""));
  const [secondsLeft, setSecondsLeft] = useState(defaultSeconds);
  const [submitting, setSubmitting] = useState(false);

  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const code = useMemo(() => otp.join(""), [otp]);
  const canSubmit = code.length === otpLen && otp.every((d) => d !== "");
  const canResend = secondsLeft <= 0;

  function pad2(n: number) {
    return String(n).padStart(2, "0");
  }

  const timeText = useMemo(() => {
    const m = Math.floor(Math.max(secondsLeft, 0) / 60);
    const s = Math.max(secondsLeft, 0) % 60;
    return `${pad2(m)}:${pad2(s)}`;
  }, [secondsLeft]);

  function focusIndex(i: number) {
    const el = inputsRef.current[i];
    el?.focus();
    el?.select();
  }

  function setDigit(i: number, value: string) {
    setOtp((prev) => {
      const next = [...prev];
      next[i] = value;
      return next;
    });
  }

  function onChange(i: number, raw: string) {
    const digits = raw.replace(/\D/g, "");
    if (!digits) {
      setDigit(i, "");
      return;
    }

    setOtp((prev) => {
      const next = [...prev];
      let idx = i;

      for (const ch of digits) {
        if (idx >= otpLen) break;
        next[idx] = ch;
        idx++;
      }

      return next;
    });

    const nextFocus = Math.min(i + digits.length, otpLen - 1);
    if (i + digits.length < otpLen) focusIndex(nextFocus);
  }

  function onKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      if (otp[i]) {
        setDigit(i, "");
        return;
      }
      if (i > 0) {
        setDigit(i - 1, "");
        focusIndex(i - 1);
      }
    }

    if (e.key === "ArrowLeft" && i > 0) focusIndex(i - 1);
    if (e.key === "ArrowRight" && i < otpLen - 1) focusIndex(i + 1);
  }

  function onPaste(i: number, text: string) {
    onChange(i, text);
  }

  async function submit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!canSubmit || submitting) return;

    setSubmitting(true);
    try {
      await options?.onVerify?.(code);
    } finally {
      setSubmitting(false);
    }
  }

  async function resend() {
    if (!canResend) return;

    try {
      await options?.onResend?.();
    } finally {
      setOtp(Array(otpLen).fill(""));
      setSecondsLeft(defaultSeconds);
      setTimeout(() => focusIndex(0), 0);
    }
  }

  // countdown
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const t = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [secondsLeft]);

  // focus first input on mount
  useEffect(() => {
    focusIndex(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    otpLen,
    otp,
    secondsLeft,
    timeText,
    submitting,
    canSubmit,
    canResend,

    inputsRef,

    onChange,
    onKeyDown,
    onPaste,

    submit,
    resend,
  };
}
