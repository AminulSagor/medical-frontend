"use client";

import { Bell } from "lucide-react";
import { useFormContext } from "react-hook-form";
import type { ComposeBroadcastInput } from "../_lib/compose-schema";

function cn(...p: Array<string | undefined | false>) {
  return p.filter(Boolean).join(" ");
}

export default function PushToggleRow() {
  const { watch, setValue } = useFormContext<ComposeBroadcastInput>();
  const enabled = watch("pushToStudentPanel");

  return (
    <section className="rounded-2xl bg-white px-6 py-5 shadow-sm ring-1 ring-slate-200/60">
      <div className="flex items-center justify-between gap-4">
        {/* left */}
        <div className="flex items-center gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-teal-50 text-teal-600 ring-1 ring-teal-100">
            <Bell size={18} />
          </div>

          <div>
            <p className="text-[14px] font-bold leading-[17.5px] text-slate-900">
              Push to Student Panel
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Send this announcement as an in-app notification to the students dashboard.
            </p>
          </div>
        </div>

        {/* toggle */}
        <button
          type="button"
          onClick={() =>
            setValue("pushToStudentPanel", !enabled, { shouldValidate: true })
          }
          className={cn(
            "relative h-8 w-14 rounded-full transition",
            enabled ? "bg-teal-500" : "bg-slate-300"
          )}
          aria-label="Toggle Push to Student Panel"
          aria-pressed={enabled}
        >
          <span
            className={cn(
              "absolute top-1 h-6 w-6 rounded-full bg-white shadow transition",
              enabled ? "left-7" : "left-1"
            )}
          />
        </button>
      </div>
    </section>
  );
}