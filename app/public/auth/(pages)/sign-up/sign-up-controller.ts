"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { AuthErrors, AuthSignupPayload } from "../../types/auth.types";
import { signupSchema } from "@/schema/auth/signup.schema";
import { zodErrorToFieldErrors } from "@/schema/zodErrorToFieldErrors";
import { registerUser, sendOtp } from "@/service/public/auth/auth.service";
import type { RegisterRequest } from "@/types/public/auth/auth.types";

export function useSignUpController() {
  const router = useRouter();

  const [form, setForm] = useState<AuthSignupPayload>({
    fullLegalName: "",
    medicalEmail: "",
    professionalRole: "",
    password: "",
    acceptedTerms: false,
  });

  const [errors, setErrors] = useState<AuthErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
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
    value: AuthSignupPayload[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
    setApiError(null);
  };

  const toggleShowPassword = () => setShowPassword((s) => !s);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = signupSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors = zodErrorToFieldErrors<AuthSignupPayload>(
        result.error,
      );
      setErrors(fieldErrors as AuthErrors);
      return;
    }

    setErrors({});
    setApiError(null);
    setSubmitting(true);

    try {
      const payload: RegisterRequest = {
        fullLegalName: result.data.fullLegalName,
        medicalEmail: result.data.medicalEmail,
        professionalRole: result.data.professionalRole,
        password: result.data.password,
        forgetPassword: false,
      };

      await registerUser(payload);

      // Send OTP to the registered email
      await sendOtp({ email: result.data.medicalEmail });

      // Redirect to OTP verification with email as query param
      router.push(
        `/auth/otp-verification?email=${encodeURIComponent(result.data.medicalEmail)}`,
      );
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setApiError(
        axiosErr?.response?.data?.message ||
          "Registration failed. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return {
    form,
    errors,
    apiError,
    strength,
    showPassword,
    submitting,
    setField,
    toggleShowPassword,
    onSubmit,
  };
}
