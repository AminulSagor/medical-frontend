"use client";

import { Users2, Video, CreditCard, RotateCcw } from "lucide-react";
import type { OnlineBookingCardProps } from "@/types/course/course-online-details-type";

export default function OnlineBookingCardClient({
  booking,
}: {
  booking: OnlineBookingCardProps;
}) {
  return (
    <section>
      <div className="mb-3 text-[11px] font-extrabold tracking-[0.18em] text-slate-300">
        {booking.heading}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_10px_22px_rgba(15,23,42,0.06)]">
        {/* Row 1 */}
        <div className="flex items-center justify-between gap-4 px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-sky-50 text-sky-600 ring-1 ring-sky-100">
              <Users2 className="h-5 w-5" />
            </div>

            <div>
              <div className="text-[10px] font-extrabold tracking-[0.14em] text-slate-300">
                STATUS
              </div>
              <div className="mt-1 text-[13px] font-extrabold text-slate-900">
                {booking.bookedText}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {}}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-sky-600 px-5 text-[12px] font-extrabold text-white shadow-sm hover:bg-sky-700 active:scale-[0.99]"
          >
            <Video className="h-4 w-4" />
            {booking.joinLiveLabel}
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-100" />

        {/* Row 2 */}
        <div className="flex items-start justify-between gap-4 px-6 py-5">
          <div className="flex items-start gap-4">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-sky-50 text-sky-600 ring-1 ring-sky-100">
              <CreditCard className="h-5 w-5" />
            </div>

            <div>
              <div className="text-[10px] font-extrabold tracking-[0.14em] text-slate-300">
                TOTAL PAYMENT
              </div>

              <div className="mt-1 text-[12px] font-extrabold text-sky-600">
                {booking.totalFeeLabel}{" "}
                <span className="text-[14px]">{booking.totalFeeValue}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <button
              type="button"
              onClick={() => {}}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-[11px] font-semibold text-slate-500 hover:bg-slate-50"
            >
              <RotateCcw className="h-4 w-4" />
              {booking.refundLabel}
            </button>

            <div className="mt-2 flex items-center gap-2 text-[10px] font-semibold text-slate-400">
              <span className="grid h-4 w-4 place-items-center rounded-full border border-slate-200 bg-white text-[10px]">
                i
              </span>
              <span>{booking.refundNote}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}