"use client";

import Image from "next/image";
import type { CourseCheckinCardProps } from "@/types/user/course/course-details-type";

export default function CourseCheckinCard(
  props: CourseCheckinCardProps & {
    onHowToCheckin: () => void;
    onDownloadTicket: () => void;
  },
) {
  const {
    title,
    subtitle,
    qrImageSrc,
    primaryBtnLabel,
    secondaryBtnLabel,
    ticketCodeLabel,
    ticketCodeValue,
    onHowToCheckin,
    onDownloadTicket,
  } = props;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
      <div className="text-[12px] font-semibold text-slate-900">{title}</div>
      <p className="mt-2 text-[12px] leading-relaxed text-slate-500">
        {subtitle}
      </p>

      <div className="mt-4 flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="relative h-[140px] w-[140px] overflow-hidden rounded-lg bg-white">
          <Image src={qrImageSrc} alt="QR" fill className="object-contain" />
        </div>
      </div>

      <button
        type="button"
        onClick={onHowToCheckin}
        className="mt-4 h-10 w-full rounded-xl bg-sky-600 text-[12px] font-semibold text-white hover:bg-sky-700 active:scale-[0.99]"
      >
        {primaryBtnLabel}
      </button>

      <button
        type="button"
        onClick={onDownloadTicket}
        className="mt-3 h-10 w-full rounded-xl border border-slate-200 bg-white text-[12px] font-semibold text-slate-800 hover:bg-slate-50 active:scale-[0.99]"
      >
        {secondaryBtnLabel}
      </button>

      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3">
        <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
          {ticketCodeLabel}
        </div>
        <div className="mt-1 text-[12px] font-semibold text-slate-900">
          {ticketCodeValue}
        </div>
      </div>
    </div>
  );
}
