"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CircleX, CreditCard, Users2 } from "lucide-react";
import { submitCourseRefundRequest } from "@/service/user/course-details.service";
import type { CourseRefundSubmitResponse } from "@/types/user/course/course-detail-api.types";
import type { CourseBookingDetailsCardProps } from "@/types/user/course/course-details-type";
import RequestRefundModalClient from "../shared/request-refund-modal";
import RefundUnavailableModalClient from "../shared/refund-unavailable-modal";
import RefundSubmittedModalClient from "../shared/refund-submitted-modal";

const CONTACT_INFO = {
  phoneLabel: "+1 (555) 012-3456",
  emailLabel: "support@simcenter.edu",
  supportHoursLabel: "SUPPORT HOURS",
  supportHoursText: "Mon-Fri, 8am - 6pm EST",
};

export default function CourseBookingDetailsCard({
  status,
  payment,
  refund,
  courseId,
}: CourseBookingDetailsCardProps) {
  const router = useRouter();
  const [openRefund, setOpenRefund] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<CourseRefundSubmitResponse | null>(null);
  const [openSubmitted, setOpenSubmitted] = useState(false);

  const handleConfirmRefund = async ({
    selectedAttendeeIds,
    reasonText,
    acknowledged,
  }: {
    selectedAttendeeIds: string[];
    reasonText: string;
    acknowledged: boolean;
  }) => {
    try {
      setSubmitting(true);
      setSubmitError(null);

      const response = await submitCourseRefundRequest(courseId, {
        attendeeIds: selectedAttendeeIds,
        reason: reasonText,
        confirmedTerms: acknowledged,
      });

      setOpenRefund(false);
      setSubmittedData(response);
      setOpenSubmitted(true);
    } catch (error) {
      console.error("Failed to submit refund request", error);
      setSubmitError("Failed to submit refund request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section>
      <div className="mb-3 text-[11px] font-extrabold tracking-[0.18em] text-slate-300">
        BOOKING DETAILS
      </div>

      <div className="rounded-[26px] border border-slate-200 bg-white shadow-[0_10px_22px_rgba(15,23,42,0.06)]">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1px_1fr]">
          <div className="flex items-center gap-4 p-6 lg:p-7">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-sky-50 text-sky-500 ring-1 ring-sky-100">
              <Users2 className="h-6 w-6" />
            </div>

            <div>
              <div className="text-[11px] font-extrabold tracking-[0.16em] text-slate-400">
                {status.label}
              </div>
              <div className="mt-1 text-[18px] font-extrabold leading-tight text-slate-900">{status.value}</div>
            </div>
          </div>

          <div className="hidden bg-slate-100 md:block" />

          <div className="flex items-start justify-between gap-4 p-6 lg:p-7">
            <div className="flex items-start gap-4">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-sky-50 text-sky-500 ring-1 ring-sky-100">
                <CreditCard className="h-6 w-6" />
              </div>

              <div className="max-w-[240px]">
                <div className="text-[11px] font-extrabold tracking-[0.16em] text-slate-400">
                  {payment.label}
                </div>
                <div className="mt-1 text-[18px] font-extrabold leading-tight text-sky-500">Total Fee:</div>
                <div className="mt-1 text-[18px] font-extrabold leading-tight text-sky-500">{payment.amount}</div>
                <div className="mt-3 flex items-start gap-2 text-[11px] leading-snug text-slate-400">
                  <span className="mt-[2px] inline-grid h-4 w-4 shrink-0 place-items-center rounded-full border border-slate-300 text-[10px] text-slate-400">i</span>
                  <span>{payment.refundNote}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpenRefund(true)}
              className="mt-1 inline-flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-[12px] font-semibold text-slate-500 hover:bg-slate-50"
            >
              <CircleX className="h-4 w-4" />
              Refund
            </button>
          </div>
        </div>
      </div>

      {refund.enabled ? (
        <RequestRefundModalClient
          open={openRefund}
          onClose={() => setOpenRefund(false)}
          courseTitle={refund.courseTitle}
          metaText={refund.courseDateText}
          refundWindowText={refund.refundWindowText}
          policyTitle="Refund Policy:"
          policyText={refund.policyText}
          totalPaidValue={refund.amountPaid}
          refundAmountValue={refund.estimatedRefund}
          processingFeeAmount={refund.processingFeeAmount}
          currency={refund.currency}
          members={refund.members}
          selection={refund.selection}
          disclaimerText="I understand that this action cannot be undone and my access to all course materials will be permanently removed."
          footnoteText={refund.description}
          submitting={submitting}
          errorText={submitError}
          onKeepBooking={() => setOpenRefund(false)}
          onConfirm={handleConfirmRefund}
        />
      ) : (
        <RefundUnavailableModalClient
          open={openRefund}
          onClose={() => setOpenRefund(false)}
          title={refund.title}
          alertTitle={refund.title}
          alertText={refund.description}
          courseTitle={refund.courseTitle}
          courseDateText={refund.courseDateText}
          helperText={refund.description}
          phoneLabel={CONTACT_INFO.phoneLabel}
          emailLabel={CONTACT_INFO.emailLabel}
          supportHoursLabel={CONTACT_INFO.supportHoursLabel}
          supportHoursText={CONTACT_INFO.supportHoursText}
          primaryCtaLabel="Contact Support"
          secondaryCtaLabel="Back to Itinerary"
          onPrimary={() => router.push("/public/contact-us")}
          onSecondary={() => setOpenRefund(false)}
        />
      )}

      <RefundSubmittedModalClient
        open={openSubmitted}
        onClose={() => setOpenSubmitted(false)}
        title={submittedData?.title || "Refund Request Submitted"}
        courseTitle={refund.courseTitle}
        subtitle={submittedData?.message || "Your refund request has been submitted."}
        requestIdValue={submittedData?.requestId || "—"}
        expectedRefundValue={submittedData?.expectedRefund || refund.estimatedRefund}
        confirmationText={submittedData ? `${submittedData.requestedMemberCount} member(s) selected for refund.` : undefined}
        footnoteText={submittedData?.message || refund.description}
        ctaLabel="Back to Course"
        onCta={() => setOpenSubmitted(false)}
      />
    </section>
  );
}
