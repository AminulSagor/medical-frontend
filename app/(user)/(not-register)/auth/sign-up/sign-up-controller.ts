"use client";

import { useMemo, useState } from "react";
import type { AuthErrors, AuthSignupPayload } from "../../auth/types/auth.types";
import { signupSchema } from "@/schema/auth/signup.schema";
import { zodErrorToFieldErrors } from "@/schema/zodErrorToFieldErrors";

type SubmitFn = (data: AuthSignupPayload) => Promise<void> | void;

export function useSignUpController(options?: { onSuccess?: SubmitFn }) {
  const [form, setForm] = useState<AuthSignupPayload>({
    fullName: "",
    email: "",
    role: "",
    password: "",
    acceptedTerms: false,
  });

  const [errors, setErrors] = useState<AuthErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const strength = useMemo(() => {
    const p = form.password;
    return {
      len: p.length >= 12,
      upper: /[A-Z]/.test(p),
      lower: /[a-z]/.test(p),
      number: /\d/.test(p),
      symbol: /[^A-Za-z0-9]/.test(p),
    };
  }, [form.password]);

  const setField = <K extends keyof AuthSignupPayload>(
    key: K,
    value: AuthSignupPayload[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const toggleShowPassword = () => setShowPassword((s) => !s);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = signupSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors = zodErrorToFieldErrors<AuthSignupPayload>(result.error);
      setErrors(fieldErrors as AuthErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      if (options?.onSuccess) {
        await options.onSuccess(result.data);
      } else {
        console.log("signup payload (validated)", result.data);
        alert("Account created (demo). Now connect your API.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return {
    form,
    errors,
    strength,
    showPassword,
    submitting,
    setField,
    toggleShowPassword,
    onSubmit,
  };
}
