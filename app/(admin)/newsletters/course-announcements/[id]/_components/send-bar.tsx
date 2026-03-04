"use client";

import { Send } from "lucide-react";
import { useFormContext } from "react-hook-form";
import type { ComposeBroadcastInput } from "../_lib/compose-schema";

export default function SendBar() {
  const {
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useFormContext<ComposeBroadcastInput>();

  const onSubmit = (values: ComposeBroadcastInput) => {
    // dummy submit for now
    console.log("SEND BROADCAST payload:", values);
    alert("Broadcast payload logged to console ✅");
  };

  return (
    <div className="pb-10 pt-8">
      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className={[
            // exact specs
            "inline-flex items-center justify-center gap-3", // gap 12px
            "h-16 w-[448px] max-w-[448px]", // 64px height, 448 width
            "px-8 py-[18px]", // left/right 32, top/bottom 18
            "rounded-2xl", // 16px radius
            // style
            "bg-slate-900 text-white",
            "text-[12px] font-bold tracking-[0.28em]",
            "shadow-[0_18px_45px_rgba(15,23,42,0.25)]",
            "hover:bg-slate-950 active:scale-[0.99] transition",
            "disabled:opacity-60 disabled:cursor-not-allowed",
          ].join(" ")}
        >
          {/* outline triangle-like send icon */}
          <Send size={18} className="opacity-90" />
          {isSubmitting ? "SENDING..." : "SEND BROADCAST"}
        </button>
      </div>

      {(errors.subject || errors.message || errors.recipientIds) && (
        <p className="mt-3 text-center text-xs text-rose-600">
          Please complete required fields before sending.
        </p>
      )}

      <p className="mt-6 text-center text-[10px] font-bold tracking-[0.35em] text-slate-300">
        CERTIFIED MEDICAL COMMUNICATION HUB
      </p>
    </div>
  );
}