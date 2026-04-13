"use client";

import { useFormContext } from "react-hook-form";
import type { ComposeBroadcastInput } from "../_lib/compose-schema";

export default function MessageContentPanel() {
  const { register } = useFormContext<ComposeBroadcastInput>();

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/60">
      <div>
        <p className="text-[14px] font-bold leading-[17.5px] text-slate-900">
          Message Content
        </p>
        <p className="text-xs text-slate-500">
          Compose your transmission details
        </p>
      </div>

      <div className="mt-5">
        <textarea
          {...register("message")}
          placeholder="Start typing clinical instructions here..."
          className="min-h-[180px] w-full rounded-xl border border-slate-200 px-5 py-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[var(--primary)] resize-none"
          rows={8}
        />
      </div>
    </section>
  );
}
