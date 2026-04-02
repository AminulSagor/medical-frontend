"use client";

import { useState } from "react";
import RefundSubmittedModalClient from "./refund-submitted-modal";

export default function RefundSubmittedLauncherClient() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full border border-slate-200 bg-white px-4 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50"
      >
        Open “Refund Submitted”
      </button>

      <RefundSubmittedModalClient
        open={open}
        onClose={() => setOpen(false)}
        title="Refund Request Submitted"
        courseTitle="Advanced Difficult Airway Workshop"
        subtitle='Your request for "Advanced Difficult Airway Workshop" has been received and is being processed.'
        requestIdValue="#REF-9921"
        expectedRefundValue="$650.00"
        confirmationText="A confirmation email has been sent to sarah.j@clinic.com."
        footnoteText="Refunds typically take 5-7 business days to reflect in your original payment method."
        ctaLabel="Back to Dashboard"
        onCta={() => setOpen(false)}
      />
    </>
  );
}