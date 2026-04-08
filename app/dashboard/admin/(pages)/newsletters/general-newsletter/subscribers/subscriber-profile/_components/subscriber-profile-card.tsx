import React from "react";
import { Mail, Phone } from "lucide-react";
import { SubscriberProfile } from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/subscribers/subscriber-profile/types/subscriber-profile.type";
function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[#d8f3f0] bg-[#eefcfb] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#14b8ad]">
      {children}
    </span>
  );
}

export default function SubscriberProfileCard({
  data,
}: {
  data: SubscriberProfile;
}) {
  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
        <div className="relative bg-gradient-to-b from-slate-900 to-slate-800 px-6 py-8">
          <div className="mx-auto flex w-full max-w-[320px] flex-col items-center text-center">
            <div className="flex h-[76px] w-[76px] items-center justify-center rounded-2xl bg-[#0e8f86] text-[26px] font-bold text-white shadow-[0_10px_30px_rgba(20,184,173,0.24)]">
              {data.initials}
            </div>

            <p className="mt-4 text-[18px] font-semibold text-white">
              {data.name}
            </p>
            <p className="mt-1 text-sm font-semibold text-[#14b8ad]">
              {data.roleLabel}
            </p>
          </div>
        </div>

        <div className="px-6 py-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
            Contact Details
          </p>

          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Mail size={16} className="text-slate-400" />
              <span className="font-medium">{data.contact.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Phone size={16} className="text-slate-400" />
              <span className="font-medium">{data.contact.phone}</span>
            </div>
          </div>

          <div className="mt-5 border-t border-slate-100 pt-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
              Professional Info
            </p>

            <div className="mt-3 space-y-3">
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-medium text-slate-400">
                  Institution
                </span>
                <span className="text-sm font-semibold text-slate-700">
                  {data.professionalInfo.institution}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-medium text-slate-400">
                  {data.professionalInfo.acquisitionLabel}
                </span>
                <Pill>{data.professionalInfo.acquisitionTag}</Pill>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-medium text-slate-400">
                  Joined Date
                </span>
                <span
                  className={cx(
                    "text-sm font-semibold text-slate-700",
                    "font-mono",
                  )}
                >
                  {data.professionalInfo.joinedDateLabel}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl border border-slate-200 bg-white" />
          <p className="text-sm font-semibold text-slate-800">Admin Notes</p>
        </div>

        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm font-medium text-slate-700">
          {data.adminNote.note}
        </div>

        <button
          type="button"
          className="mt-4 text-sm font-semibold text-[#14b8ad] hover:opacity-80"
        >
          + Add Internal Note
        </button>
      </div>
    </div>
  );
}
