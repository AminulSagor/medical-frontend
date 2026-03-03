"use client";

import React from "react";
import Card from "@/components/cards/card";
import Button from "@/components/buttons/button";
import { Check, X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  onBackHome?: () => void;
};

export default function MessageSentDialog({
  open,
  onClose,
  onBackHome,
}: Props) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* overlay */}
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40"
      />

      {/* dialog */}
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div className="relative w-full max-w-[520px]">
          {/* close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-light-slate/25 bg-white text-slate-500 transition hover:bg-slate-50"
          >
            <X className="h-4 w-4" />
          </button>

          <Card
            shape="soft"
            className="border border-light-slate/20 p-8 shadow-lg"
          >
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-emerald-500 bg-white">
                  <Check className="h-5 w-5 text-emerald-500" />
                </div>
              </div>

              <h3 className="mt-5 text-2xl font-semibold text-slate-900">
                Message Sent Successfully!
              </h3>

              <p className="mt-3 max-w-[420px] text-sm leading-6 text-slate-500">
                Thank you for reaching out. Our clinical simulation specialists
                have received your inquiry and will get back to you within 24-48
                business hours.
              </p>

              <Button
                size="lg"
                className="mt-7 w-full rounded-2xl py-3"
                onClick={onBackHome ?? onClose}
              >
                Back to Home
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
