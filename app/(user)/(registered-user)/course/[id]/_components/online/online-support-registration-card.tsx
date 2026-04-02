import { Headset, ArrowRight } from "lucide-react";
import type { OnlineSupportAndRegistrationCardProps } from "@/types/course/course-online-details-type";

export default function OnlineSupportRegistrationCard({
  help,
  registration,
}: OnlineSupportAndRegistrationCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Help Section */}
      <div className="p-5">
        <div className="rounded-xl border border-sky-100 bg-sky-50/40 p-5">
          <div className="flex items-start gap-4">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-sky-100 text-sky-600">
              <Headset className="h-5 w-5" />
            </div>

            <div>
              <div className="text-[15px] font-semibold text-slate-900">
                {help.title}
              </div>

              <div className="mt-1 text-[13px] text-slate-500">
                {help.subtitle}
              </div>

              <button
                type="button"
                className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-sky-600 hover:text-sky-700"
              >
                {help.actionLabel}
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-slate-100" />

      {/* Registration */}
      <div className="px-5 py-6 text-center">
        <div className="text-[11px] font-semibold tracking-[0.18em] text-slate-400">
          {registration.heading}
        </div>

        <div className="mt-4 inline-flex rounded-full border border-slate-200 bg-slate-50 px-5 py-2 text-[13px] font-semibold text-slate-900">
          {registration.value}
        </div>
      </div>
    </div>
  );
}