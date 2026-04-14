"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, RotateCcw, Users2, Video } from "lucide-react";
import {
  getCourseMeetingInfo,
  submitCourseRefundRequest,
} from "@/service/user/course-details.service";
import type {
  CourseMeetingInfoResponse,
  CourseRefundSubmitResponse,
} from "@/types/user/course/course-detail-api.types";
import type { OnlineBookingCardProps } from "@/types/user/course/course-online-details-type";
import RequestRefundModalClient from "../shared/request-refund-modal";
import RefundUnavailableModalClient from "../shared/refund-unavailable-modal";
import JoinLiveModalClient from "../shared/join-live-modal";
import RefundSubmittedModalClient from "../shared/refund-submitted-modal";

const CONTACT_INFO = {
  phoneLabel: "+1 (555) 012-3456",
  emailLabel: "support@simcenter.edu",
  supportHoursLabel: "SUPPORT HOURS",
  supportHoursText: "Mon-Fri, 8am - 6pm EST",
};

function parseRefundAmount(value: string) {
  const normalized = value.replace(/[^\d.-]/g, "");
  const amount = Number.parseFloat(normalized);
  return Number.isFinite(amount) ? amount : 0;
}

export default function OnlineBookingCardClient({
  booking,
}: {
  booking: OnlineBookingCardProps;
}) {
  const router = useRouter();
  const [openRefund, setOpenRefund] = useState(false);
  const [openMeeting, setOpenMeeting] = useState(false);
  const [loadingMeeting, setLoadingMeeting] = useState(false);
  const [meetingData, setMeetingData] = useState<CourseMeetingInfoResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<CourseRefundSubmitResponse | null>(null);
  const [openSubmitted, setOpenSubmitted] = useState(false);

  const handleOpenMeeting = async () => {
    setOpenMeeting(true);
    try {
      setLoadingMeeting(true);
      const response = await getCourseMeetingInfo(booking.courseId);
      setMeetingData(response);
    } catch (error) {
      console.error("Failed to load meeting info", error);
      setMeetingData(null);
    } finally {
      setLoadingMeeting(false);
    }
  };

  const handleConfirmRefund = async ({
    reasonText,
    acknowledged,
  }: {
    reasonText: string;
    acknowledged: boolean;
  }) => {
    try {
      setSubmitting(true);
      setSubmitError(null);

      const response = await submitCourseRefundRequest(booking.courseId, {
        refundAmount: parseRefundAmount(booking.refundAmount),
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
    <>
      <section>
        <div className="mb-3 text-[11px] font-extrabold tracking-[0.18em] text-slate-300">
          {booking.heading}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_10px_22px_rgba(15,23,42,0.06)]">
          <div className="flex items-center justify-between gap-4 px-6 py-5">
            <div className="flex items-center gap-4">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-sky-50 text-sky-600 ring-1 ring-sky-100">
                <Users2 className="h-5 w-5" />
              </div>

              <div>
                <div className="text-[10px] font-extrabold tracking-[0.14em] text-slate-300">
                  STATUS
                </div>
                <div className="mt-1 text-[13px] font-extrabold text-slate-900">{booking.bookedText}</div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleOpenMeeting}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-sky-600 px-5 text-[12px] font-extrabold text-white shadow-sm hover:bg-sky-700 active:scale-[0.99]"
            >
              <Video className="h-4 w-4" />
              {booking.joinLiveLabel}
            </button>
          </div>

          <div className="h-px bg-slate-100" />

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
                  {booking.totalFeeLabel} <span className="text-[14px]">{booking.totalFeeValue}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <button
                type="button"
                onClick={() => setOpenRefund(true)}
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

      {booking.refundEnabled ? (
        <RequestRefundModalClient
          open={openRefund}
          onClose={() => setOpenRefund(false)}
          courseTitle={booking.courseTitle}
          metaText={booking.courseDateText}
          refundWindowText={`${booking.daysBeforeStart} day(s) before start`}
          policyTitle="Refund Policy:"
          policyText={booking.refundPolicyText}
          totalPaidValue={booking.totalFeeValue}
          refundAmountValue={booking.refundAmount}
          feeText=""
          disclaimerText="I understand that this action cannot be undone and my access to all course materials will be permanently removed."
          footnoteText={booking.refundNote}
          submitting={submitting}
          errorText={submitError}
          onKeepBooking={() => setOpenRefund(false)}
          onConfirm={handleConfirmRefund}
        />
      ) : (
        <RefundUnavailableModalClient
          open={openRefund}
          onClose={() => setOpenRefund(false)}
          title={booking.refundTitle}
          alertTitle={booking.refundTitle}
          alertText={booking.refundDescription}
          courseTitle={booking.courseTitle}
          courseDateText={booking.courseDateText}
          helperText={booking.refundDescription}
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

      <JoinLiveModalClient
        open={openMeeting}
        onClose={() => setOpenMeeting(false)}
        loading={loadingMeeting}
        data={meetingData}
      />

      <RefundSubmittedModalClient
        open={openSubmitted}
        onClose={() => setOpenSubmitted(false)}
        title={submittedData?.title || "Refund Request Submitted"}
        courseTitle={booking.courseTitle}
        subtitle={submittedData?.message || "Your refund request has been submitted."}
        requestIdValue="not in api"
        expectedRefundValue={submittedData?.refundAmountRequested || booking.refundAmount}
        confirmationText={submittedData?.reasonRecorded || "not in api"}
        footnoteText={submittedData?.message || booking.refundNote}
        ctaLabel="Back to Course"
        onCta={() => setOpenSubmitted(false)}
      />
    </>
  );
}
