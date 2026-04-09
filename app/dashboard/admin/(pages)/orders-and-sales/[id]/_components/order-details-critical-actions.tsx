"use client";

import { useState } from "react";
import { Loader2, Undo2 } from "lucide-react";
import { createAdminOrderRefund } from "@/service/admin/orders/order-refund.service";

function Panel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "rounded-2xl border border-slate-200 bg-white shadow-sm",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

export default function OrderDetailsCriticalActions({
  orderId,
}: {
  orderId: string;
}) {
  const [isRefundFormOpen, setIsRefundFormOpen] = useState(false);
  const [refundReason, setRefundReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const trimmedReason = refundReason.trim();
  const isSubmitDisabled = !trimmedReason || isSubmitting;

  const handleToggleRefundForm = () => {
    if (isSubmitting) return;

    setIsRefundFormOpen((prev) => !prev);
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleSubmitRefund = async () => {
    if (!trimmedReason || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");
      setSuccessMessage("");

      const response = await createAdminOrderRefund(orderId, {
        reason: trimmedReason,
      });

      setSuccessMessage(
        response.message || "Refund request submitted successfully.",
      );
      setRefundReason("");
      setIsRefundFormOpen(false);
    } catch (error) {
      console.error("Failed to create refund:", error);
      setErrorMessage("Failed to submit refund request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Panel className="relative overflow-hidden rounded-2xl border border-[#e73508]/30 bg-gradient-to-br from-white via-white to-[#fff9f7] shadow-[0_12px_35px_rgba(231,53,8,0.12)] ring-1 ring-[#e73508]/20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_55%_45%,rgba(231,53,8,0.08),transparent_65%)] opacity-80" />
      <div className="pointer-events-none absolute left-6 top-6 h-24 w-24 rounded-full bg-[#e73508]/12 blur-3xl" />

      <div className="relative px-6 py-6">
        <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#e73508]">
          Critical Actions
        </div>

        <button
          type="button"
          onClick={handleToggleRefundForm}
          disabled={isSubmitting}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#e73508]/40 bg-white/70 px-4 py-3 text-sm font-bold text-[#e73508] hover:bg-[#e73508]/10 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Undo2 size={18} />
          Issue Refund
        </button>

        {isRefundFormOpen ? (
          <div className="mt-4 space-y-3">
            <textarea
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              placeholder="Write refund reason..."
              className="min-h-28 w-full resize-none rounded-2xl border border-[#e73508]/20 bg-white/90 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-[#e73508]"
            />

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleSubmitRefund}
                disabled={isSubmitDisabled}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#e73508] px-4 py-3 text-sm font-bold text-white hover:bg-[#cf2f07] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Confirm Refund"
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (isSubmitting) return;
                  setIsRefundFormOpen(false);
                  setRefundReason("");
                  setErrorMessage("");
                }}
                disabled={isSubmitting}
                className="rounded-full border border-[#e73508]/20 px-4 py-3 text-sm font-bold text-[#e73508] hover:bg-[#e73508]/5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : null}

        {successMessage ? (
          <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            {successMessage}
          </div>
        ) : null}

        {errorMessage ? (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
            {errorMessage}
          </div>
        ) : null}

        <div className="mt-4 text-center text-xs italic font-medium text-[#e73508]/55">
          Refunds require administrative override.
        </div>
      </div>
    </Panel>
  );
}
