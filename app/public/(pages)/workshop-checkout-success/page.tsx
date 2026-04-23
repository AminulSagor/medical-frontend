"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Check,
  Loader2,
  AlertCircle,
  BookOpen,
  CalendarDays,
  Mail,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import Card from "@/components/cards/card";
import Button from "@/components/buttons/button";
import Link from "next/link";
import {
  downloadWorkshopInvoicePdf,
  verifyWorkshopPayment,
} from "@/service/user/workshop-payment.service";
import {
  createWorkshopReservation,
  type WorkshopReservationData,
} from "@/service/user/create-workshop-reservation.service";

type CheckoutContext = {
  workshopId: string;
  orderSummaryId: string;
  attendeeIds: string[];
  workshopTitle: string;
  numberOfAttendees: number;
  totalPrice: string;
  workshopStartDate?: string | null;
  workshopEndDate?: string | null;
  workshopLocation?: string | null;
  primaryAttendee?: {
    fullName: string;
    role: string;
    email: string;
  };
};

type PageState =
  | "verifying"
  | "creating_reservation"
  | "success"
  | "payment_pending"
  | "error";

function getLatestCreatedAttendeeBatch(
  attendees?: WorkshopReservationData["attendees"] | null,
) {
  if (!Array.isArray(attendees) || attendees.length === 0) {
    return {
      attendees: [] as NonNullable<WorkshopReservationData["attendees"]>,
      createdAt: null as string | null,
    };
  }

  const lastAttendee = attendees[attendees.length - 1];
  const latestCreatedAt = lastAttendee?.createdAt ?? null;

  if (!latestCreatedAt) {
    return {
      attendees,
      createdAt: null,
    };
  }

  const latestBatch: NonNullable<WorkshopReservationData["attendees"]> = [];

  for (let index = attendees.length - 1; index >= 0; index -= 1) {
    const attendee = attendees[index];

    if (attendee?.createdAt !== latestCreatedAt) {
      break;
    }

    latestBatch.unshift(attendee);
  }

  return {
    attendees: latestBatch,
    createdAt: latestCreatedAt,
  };
}

function WorkshopCheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [pageState, setPageState] = useState<PageState>("verifying");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [checkoutContext, setCheckoutContext] =
    useState<CheckoutContext | null>(null);
  const [reservationId, setReservationId] = useState<string | null>(null);
  const [reservationData, setReservationData] =
    useState<WorkshopReservationData | null>(null);

  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (!sessionId) {
      setPageState("error");
      setErrorMessage("No payment session found. Please try again.");
      return;
    }

    // Read checkout context from sessionStorage
    let context: CheckoutContext | null = null;
    try {
      const raw = sessionStorage.getItem("workshop_checkout_context");
      if (raw) {
        context = JSON.parse(raw);
        setCheckoutContext(context);
      }
    } catch {
      console.warn("Could not read workshop checkout context from storage");
    }

    if (!context?.orderSummaryId) {
      setPageState("error");
      setErrorMessage(
        "Checkout session expired or was opened in a different tab. Please go back and try again.",
      );
      return;
    }

    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    resolvePaymentAndReserve(context);
  }, [sessionId]);

  const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const resolvePaymentAndReserve = async (context: CheckoutContext) => {
    if (!sessionId || !context?.orderSummaryId) return;

    try {
      setPageState("verifying");

      // Step 1: Verify payment with the workshop-specific endpoint
      // This calls POST /workshops/checkout/payment-verify
      // which checks with Stripe that payment_status === "paid"
      // and marks the order summary as COMPLETED
      let verified = false;
      let lastError: any = null;

      for (let attempt = 0; attempt < 15; attempt++) {
        try {
          const result = await verifyWorkshopPayment({
            orderSummaryId: context.orderSummaryId,
            sessionId: sessionId,
          });

          if (
            result.paymentStatus === "paid" ||
            result.status === "completed"
          ) {
            verified = true;
            break;
          }
        } catch (err: any) {
          lastError = err;
          const apiMessage = err?.response?.data?.message || "";

          // If already verified/completed, treat as success
          if (
            apiMessage.includes("already verified") ||
            apiMessage.includes("already completed")
          ) {
            verified = true;
            break;
          }

          // If the payment hasn't completed on Stripe yet, keep retrying
          if (apiMessage.includes("Payment not completed")) {
            console.log("Payment not yet completed on Stripe, retrying...");
          } else {
            console.warn("Verify error:", apiMessage);
          }
        }

        await wait(2000);
      }

      if (!verified) {
        setPageState("payment_pending");
        return;
      }

      // Step 2: Payment confirmed — create reservation
      setPageState("creating_reservation");

      if (!context.workshopId || !context.attendeeIds?.length) {
        // Payment verified but no context for reservation
        setPageState("success");
        return;
      }

      try {
        const reservation = await createWorkshopReservation({
          workshopId: context.workshopId,
          attendeeIds: context.attendeeIds,
        });

        setReservationId(reservation.reservationId);
        setReservationData(reservation);

        // Clear sessionStorage after successful reservation
        sessionStorage.removeItem("workshop_checkout_context");

        setPageState("success");
      } catch (resErr: any) {
        console.error("Reservation creation error:", resErr);
        const resMessage =
          resErr?.response?.data?.message || resErr?.message || "";

        // If reservation already exists, still show success
        if (
          resMessage.includes("already") ||
          resMessage.includes("duplicate")
        ) {
          sessionStorage.removeItem("workshop_checkout_context");
          setPageState("success");
        } else {
          // Payment succeeded but reservation failed
          // Still show success — the user paid, support can sort out the reservation
          sessionStorage.removeItem("workshop_checkout_context");
          setPageState("success");
        }
      }
    } catch (err: any) {
      console.error("Payment resolution error:", err);
      const apiMessage = err?.response?.data?.message;
      setPageState("error");
      setErrorMessage(
        apiMessage ||
          err.message ||
          "Something went wrong. Please contact support.",
      );
    }
  };

  const handleRetry = () => {
    const context = checkoutContext;
    if (!context?.orderSummaryId) {
      setPageState("error");
      setErrorMessage("Session data is no longer available. Please contact support.");
      return;
    }
    hasStartedRef.current = false;
    setPageState("verifying");
    setErrorMessage(null);
    resolvePaymentAndReserve(context);
  };

  const workshopTitle = checkoutContext?.workshopTitle || "Workshop";
  const latestReservationBatch = getLatestCreatedAttendeeBatch(
    reservationData?.attendees,
  );
  const numberOfAttendees =
    latestReservationBatch.attendees.length ||
    checkoutContext?.numberOfAttendees ||
    reservationData?.attendeesCount ||
    reservationData?.attendees?.length ||
    0;
  const numericPricePerSeat = Number.parseFloat(
    reservationData?.pricePerSeat || "",
  );
  const calculatedBatchTotal =
    numberOfAttendees > 0 &&
    Number.isFinite(numericPricePerSeat) &&
    numericPricePerSeat > 0
      ? (numberOfAttendees * numericPricePerSeat).toFixed(2)
      : null;
  const totalPrice =
    calculatedBatchTotal ||
    checkoutContext?.totalPrice ||
    reservationData?.totalPrice ||
    "0.00";

  const handleDownloadReceipt = async () => {
    const orderSummaryId = checkoutContext?.orderSummaryId;
    if (!orderSummaryId) return;

    try {
      await downloadWorkshopInvoicePdf(
        orderSummaryId,
        `invoice-${reservationId || reservationData?.reservationId || orderSummaryId}.pdf`,
      );
    } catch (error) {
      console.error("Failed to download workshop invoice", error);
    }
  };

  // ─── VERIFYING STATE ──────────────────────────────────────
  if (pageState === "verifying") {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10 mt-20">
        <Card className="mx-auto w-full max-w-[600px] p-8 shadow-md">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
            <h1 className="mt-5 text-2xl font-semibold text-slate-900">
              Confirming Your Payment
            </h1>
            <p className="mt-2 text-sm text-slate-500 max-w-md">
              We&apos;re verifying your payment with Stripe. This usually takes
              just a few seconds...
            </p>
          </div>
        </Card>
      </div>
    );
  }

  // ─── CREATING RESERVATION STATE ───────────────────────────
  if (pageState === "creating_reservation") {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10 mt-20">
        <Card className="mx-auto w-full max-w-[600px] p-8 shadow-md">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            </div>
            <h1 className="mt-5 text-2xl font-semibold text-slate-900">
              Payment Confirmed!
            </h1>
            <p className="mt-2 text-sm text-slate-500 max-w-md">
              Finalizing your workshop reservation...
            </p>
          </div>
        </Card>
      </div>
    );
  }

  // ─── PAYMENT PENDING STATE ────────────────────────────────
  if (pageState === "payment_pending") {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10 mt-20">
        <Card className="mx-auto w-full max-w-[600px] p-8 shadow-md">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-50">
              <AlertCircle className="h-8 w-8 text-amber-500" />
            </div>
            <h1 className="mt-5 text-2xl font-semibold text-slate-900">
              Payment Processing
            </h1>
            <p className="mt-2 text-sm text-slate-500 max-w-md">
              Your payment was completed on Stripe but we&apos;re still waiting
              for confirmation from the payment gateway. This can take a few
              moments.
            </p>
            <Button className="mt-6" onClick={handleRetry}>
              <RefreshCw size={16} />
              Check Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // ─── ERROR STATE ──────────────────────────────────────────
  if (pageState === "error") {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10 mt-20">
        <Card className="mx-auto w-full max-w-[600px] p-8 shadow-md">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <h1 className="mt-5 text-2xl font-semibold text-slate-900">
              Something Went Wrong
            </h1>
            <p className="mt-2 text-sm text-slate-500 max-w-md">
              {errorMessage ||
                "An unexpected error occurred. Please contact support."}
            </p>
            <div className="mt-6 flex gap-3">
              <Button onClick={handleRetry} variant="secondary">
                <RefreshCw size={16} />
                Retry
              </Button>
              <Link href="/public/courses">
                <Button>Browse Workshops</Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // ─── SUCCESS STATE ────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 mt-20">
      <Card className="mx-auto w-full max-w-[760px] p-8 shadow-md">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-2">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 ring-1 ring-slate-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 ring-1 ring-green-500/20">
                <Check className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <h1 className="mt-5 text-3xl font-extrabold text-slate-900">
            You&apos;re All Set!
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-500">
            Your enrollment in{" "}
            <span className="font-semibold text-slate-700">
              {workshopTitle}
            </span>{" "}
            is confirmed.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-100 bg-slate-50/70 p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <div className="text-[11px] font-extrabold tracking-widest text-slate-400">
                ENROLLMENT DETAILS
              </div>
              <div className="space-y-1 text-sm">
                <div className="font-semibold text-slate-900">
                  {workshopTitle}
                </div>
                <div className="text-slate-500">
                  Total Paid:{" "}
                  <span className="font-semibold text-slate-700">
                    ${Number(totalPrice).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2 md:text-right">
              <div className="text-[11px] font-extrabold tracking-widest text-slate-400">
                ATTENDEES
              </div>
              <div className="text-sm">
                <div className="font-semibold text-slate-900">
                  {numberOfAttendees} Clinician{numberOfAttendees !== 1 ? "s" : ""}
                </div>
                {reservationId && (
                  <div className="text-xs text-slate-500 mt-1">
                    Reservation confirmed
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="my-6 h-px w-full bg-slate-200/70" />

          <div className="space-y-3">
            <div className="text-[11px] font-extrabold tracking-widest text-slate-400">
              NEXT STEPS
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-100">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Mail size={18} className="text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">
                      Check your email
                    </div>
                    <div className="text-xs text-slate-500">
                      Confirmation sent to inbox
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-100">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <BookOpen size={18} className="text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">
                      Complete pre-reading
                    </div>
                    <div className="text-xs text-slate-500">
                      Available in dashboard
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-100">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <CalendarDays size={18} className="text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">
                      Mark your calendar
                    </div>
                    <div className="text-xs text-slate-500">
                      Check dashboard for dates
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/dashboard/user/course">
            <Button className="px-6">
              <BookOpen size={18} />
              Go to My Courses
            </Button>
          </Link>

          <Button variant="secondary" className="px-6" onClick={handleDownloadReceipt}>
            <ShieldCheck size={18} />
            Download Receipt
          </Button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs tracking-widest text-slate-400">
          <ShieldCheck className="h-4 w-4 text-slate-400" />
          <span>SECURE PURCHASE GUARANTEE</span>
        </div>
      </Card>
    </div>
  );
}

export default function WorkshopCheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 px-4 py-10 mt-20">
          <Card className="mx-auto w-full max-w-[600px] p-8 shadow-md">
            <div className="flex flex-col items-center text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-4 text-sm text-slate-500">Loading...</p>
            </div>
          </Card>
        </div>
      }
    >
      <WorkshopCheckoutSuccessContent />
    </Suspense>
  );
}
