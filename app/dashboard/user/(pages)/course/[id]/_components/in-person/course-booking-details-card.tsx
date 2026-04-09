// app/(user)/(registered-user)/course/[id]/_components/in-person/course-booking-details-card.tsx
"use client";

import { useState } from "react";
import { Users2, CreditCard, RotateCcw } from "lucide-react";
import type { CourseBookingDetailsCardProps } from "@/types/user/course/course-details-type";
import RequestRefundModalClient, {
  type RefundReason,
} from "../shared/request-refund-modal";

export default function CourseBookingDetailsCard({
  status,
  payment,
  refund,
}: CourseBookingDetailsCardProps) {
  const [openRefund, setOpenRefund] = useState(false);

  // ✅ Dummy only (later backend will provide)
  const reasons: RefundReason[] = [
    { id: "schedule", label: "Schedule conflict" },
    { id: "travel", label: "Travel issues" },
    { id: "medical", label: "Medical emergency" },
    { id: "duplicate", label: "Duplicate booking" },
    { id: "other", label: "Other" },
  ];

  return (
    <section>
      <div className="mb-3 text-[11px] font-extrabold tracking-[0.18em] text-slate-300">
        BOOKING DETAILS
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_10px_22px_rgba(15,23,42,0.06)]">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1px_1fr]">
          {/* STATUS */}
          <div className="flex items-start gap-4 p-6">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-sky-50 text-sky-600 ring-1 ring-sky-100">
              <Users2 className="h-5 w-5" />
            </div>

            <div>
              <div className="text-[10px] font-extrabold tracking-[0.14em] text-slate-300">
                {status.label}
              </div>
              <div className="mt-1 text-[14px] font-extrabold text-slate-900">
                {status.value}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden bg-slate-100 md:block" />

          {/* PAYMENT */}
          <div className="flex items-start justify-between gap-4 p-6">
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-sky-50 text-sky-600 ring-1 ring-sky-100">
                <CreditCard className="h-5 w-5" />
              </div>

              <div>
                <div className="text-[10px] font-extrabold tracking-[0.14em] text-slate-300">
                  {payment.label}
                </div>

                <div className="mt-1 text-[14px] font-extrabold text-sky-600">
                  {payment.title}
                </div>

                <div className="mt-1 text-[18px] font-extrabold text-sky-600">
                  {payment.amount}
                </div>

                <div className="mt-2 text-[11px] leading-relaxed text-slate-400">
                  {payment.refundNote}
                </div>
              </div>
            </div>

            {/* Refund button -> only opens modal */}
            <button
              type="button"
              onClick={() => setOpenRefund(true)}
              className="mt-1 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-[12px] font-semibold text-slate-600 hover:bg-slate-50"
            >
              <RotateCcw className="h-4 w-4" />
              {refund.label}
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Refund modal (UI only, backend later) */}
      <RequestRefundModalClient
        open={openRefund}
        onClose={() => setOpenRefund(false)}
        courseTitle="Advanced Difficult Airway Workshop"
        metaText="Mar 12 - 14 • Booked for: 1 Attendee"
        refundWindowText="2d 4h remaining"
        policyTitle="Refund Policy:"
        policyText=" Full refunds are available up to 48 hours before the event. Requests made within 48 hours are subject to a $50 processing fee."
        totalPaidValue={payment.amount}
        refundAmountValue="$600.00"
        feeText="-$50.00 fee"
        disclaimerText="I understand that this action cannot be undone and my access to all course materials and recordings will be permanently removed."
        footnoteText="Refunds typically take 5–7 business days to process to your original payment method (Visa ending in 4242)."
        reasons={reasons}
        onKeepBooking={() => setOpenRefund(false)}
        onConfirm={() => setOpenRefund(false)}
      />
    </section>
  );
}
