// Optional quick test usage (wherever you want to open it)
// app/(user)/(registered-user)/course/[id]/_components/shared/refund-unavailable-launcher.client.tsx
"use client";

import { useState } from "react";
import RefundUnavailableModalClient from "./refund-unavailable-modal";

export default function RefundUnavailableLauncherClient() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full border border-slate-200 bg-white px-4 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50"
      >
        Open “Unable to Process Refund”
      </button>

      <RefundUnavailableModalClient
        open={open}
        onClose={() => setOpen(false)}
        title="Unable to Process Refund"
        alertTitle="Refund Window Expired:"
        alertText=" Our policy allows for refunds up to 48 hours before the event. As this workshop starts in less than 48 hours, an automated refund cannot be processed."
        courseTitle="Advanced Difficult Airway Workshop"
        courseDateText="March 12 - 14, 2024"
        helperText="If you have an extenuating circumstance or an emergency, please contact our support team directly for assistance."
        phoneLabel="(555) 123-4567"
        emailLabel="support@texasairway.com"
        supportHoursLabel="SUPPORT HOURS"
        supportHoursText="Available Mon-Fri, 8 AM - 5 PM CST"
        primaryCtaLabel="Contact Support"
        secondaryCtaLabel="Back to Itinerary"
        onPrimary={() => { window.location.href = "/public/contact-us"; }}
        onSecondary={() => setOpen(false)}
      />
    </>
  );
}