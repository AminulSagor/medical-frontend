"use client";

import React from "react";
import { ArrowLeft, Mail, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import type { SubscriberProfile } from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/subscribers/subscriber-profile/types/subscriber-profile.type";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function StatusPill({ status }: { status: SubscriberProfile["status"] }) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em]",
        status === "subscribed"
          ? "border-[#b7efe9] bg-[#e8fbf8] text-[#14b8ad]"
          : "border-slate-200 bg-slate-50 text-slate-500",
      )}
    >
      {status}
    </span>
  );
}

export default function SubscriberProfileHeader({
  data,
  onEdit,
}: {
  data: SubscriberProfile;
  onEdit: () => void;
}) {
  const router = useRouter();

  return (
    <header>
      <div>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600"
              aria-label="Go back"
            >
              <ArrowLeft size={18} />
            </button>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">
                {data.breadcrumbLabel}
              </p>

              <div className="mt-1 flex flex-wrap items-center gap-2">
                <p className="truncate text-[13px] text-slate-500">
                  {data.name}
                </p>
                <StatusPill status={data.status} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 md:justify-end">
            {/* <button
              type="button"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Mail size={16} className="text-slate-500" />
              Message
            </button> */}

            <button
              type="button"
              onClick={onEdit}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#0e8f86] px-4 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(20,184,173,0.18)] hover:opacity-95"
            >
              <Pencil size={16} />
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
