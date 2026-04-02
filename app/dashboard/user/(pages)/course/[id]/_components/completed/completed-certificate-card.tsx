"use client";

import { Download, Share2, CheckCircle2 } from "lucide-react";
import type { CompletedCertificateCardProps } from "@/types/course/course-completed-details-type";

export default function CompletedCertificateCardClient(props: CompletedCertificateCardProps) {
  const {
    title,
    subtitle,
    congratsTitle,
    congratsText,
    primaryBtnLabel,
    secondaryBtnLabel,
    referenceLabel,
    referenceValue,
  } = props;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="text-center">
        <div className="text-[13px] font-extrabold text-slate-900">{title}</div>
        <div className="mt-1 text-[12px] text-slate-500">{subtitle}</div>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center">
        <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-emerald-600 text-white">
          <CheckCircle2 className="h-5 w-5" />
        </div>

        <div className="mt-3 text-[13px] font-extrabold text-slate-900">{congratsTitle}</div>
        <div className="mt-1 text-[12px] leading-relaxed text-slate-500">{congratsText}</div>

        <button
          type="button"
          onClick={() => {}}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#35BEEA] px-4 py-3 text-[12px] font-extrabold text-white shadow-sm hover:opacity-95"
        >
          <Download className="h-4 w-4" />
          {primaryBtnLabel}
        </button>

        <button
          type="button"
          onClick={() => {}}
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-[12px] font-extrabold text-slate-700 hover:bg-slate-50"
        >
          <Share2 className="h-4 w-4" />
          {secondaryBtnLabel}
        </button>
      </div>

      <div className="mt-5 text-center">
        <div className="text-[10px] font-extrabold tracking-[0.18em] text-slate-300">
          {referenceLabel}
        </div>
        <div className="mt-2 inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-[12px] font-extrabold text-slate-800">
          {referenceValue}
        </div>
      </div>
    </div>
  );
}