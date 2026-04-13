"use client";

import { Send } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import type { ComposeBroadcastInput } from "../_lib/compose-schema";

type Props = {
  onSend: (values: ComposeBroadcastInput) => Promise<void>;
};

export default function SendBar({ onSend }: Props) {
  const {
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useFormContext<ComposeBroadcastInput>();

  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = async (values: ComposeBroadcastInput) => {
    try {
      setSubmitError(null);
      await onSend(values);
    } catch (error) {
      console.error("Failed to send broadcast:", error);
      setSubmitError("Failed to send broadcast. Please try again.");
    }
  };

  return (
    <div className="pb-10 pt-8">
      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="inline-flex h-16 w-[448px] max-w-[448px] items-center justify-center gap-3 rounded-2xl bg-slate-900 px-8 py-[18px] text-[12px] font-bold tracking-[0.28em] text-white shadow-[0_18px_45px_rgba(15,23,42,0.25)] transition hover:bg-slate-950 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send size={18} className="opacity-90" />
          {isSubmitting ? "SENDING..." : "SEND BROADCAST"}
        </button>
      </div>

      {(errors.subject || errors.message || errors.recipientIds) && (
        <p className="mt-3 text-center text-xs text-rose-600">
          Please complete required fields before sending.
        </p>
      )}

      {submitError ? (
        <p className="mt-3 text-center text-xs text-rose-600">{submitError}</p>
      ) : null}

      <p className="mt-6 text-center text-[10px] font-bold tracking-[0.35em] text-slate-300">
        CERTIFIED MEDICAL COMMUNICATION HUB
      </p>
    </div>
  );
}
