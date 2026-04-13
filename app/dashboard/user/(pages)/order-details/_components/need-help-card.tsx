"use client";

import { Headset, ArrowRight } from "lucide-react";

type Props = {
  onContactSupport?: () => void;
};

export default function NeedHelpCard({ onContactSupport }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl bg-[#04131a] p-5 text-white shadow-[0_12px_28px_rgba(15,23,42,0.18)]">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15">
          <Headset className="h-5 w-5 text-primary" />
        </div>

        <div>
          <h3 className="text-2xl font-semibold text-white">Need Help?</h3>
          <p className="mt-3 text-sm leading-6 text-white/80">
            If you have questions about your medical equipment order, our
            clinical support team is here for you.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onContactSupport}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
      >
        Contact Support
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}
