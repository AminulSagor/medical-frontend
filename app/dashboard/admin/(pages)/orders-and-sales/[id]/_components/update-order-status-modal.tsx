"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, Loader2, RefreshCw } from "lucide-react";

type OrderStatus = "processing" | "shipped" | "received";
type UpdateOrderStatusModalState = "confirm" | "loading" | "success";

function pillClass(active: boolean) {
  return [
    "inline-flex items-center justify-center rounded-full px-6 py-2 text-xs font-extrabold uppercase border",
    active
      ? "border-[var(--primary)]/40 bg-[var(--primary-50)] text-[var(--primary)]"
      : "border-slate-300 bg-slate-200 text-slate-500",
  ].join(" ");
}

function labelOf(s: OrderStatus) {
  if (s === "processing") return "Processing";
  if (s === "shipped") return "Shipped";
  return "Received";
}

export default function UpdateOrderStatusModal({
  open,
  orderId,
  fromStatus,
  toStatus,
  state = "confirm",
  message,
  onClose,
  onConfirm,
}: {
  open: boolean;
  orderId: string;
  fromStatus: OrderStatus;
  toStatus: OrderStatus;
  state?: UpdateOrderStatusModalState;
  message?: string;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
}) {
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && state !== "loading") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose, state]);

  if (!open) return null;

  const isLoading = state === "loading";
  const isSuccess = state === "success";

  return createPortal(
    <div className="fixed inset-0 z-[9999]">
      <button
        type="button"
        aria-label="Close modal"
        onClick={() => {
          if (!isLoading) onClose();
        }}
        className="absolute inset-0 bg-black/35 backdrop-blur-[2px]"
      />

      <div className="relative flex h-full w-full items-center justify-center p-4">
        <div className="w-full max-w-[420px] rounded-3xl bg-white p-8 shadow-2xl">
          <div className="flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary)] text-white shadow-md">
              {isSuccess ? (
                <CheckCircle2 size={20} />
              ) : isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <RefreshCw size={20} />
              )}
            </div>
          </div>

          <div className="mt-5 text-center">
            <div className="text-lg font-extrabold text-slate-900">
              {isSuccess ? "Order Status Updated" : "Update Order Status"}
            </div>

            <p className="mt-2 text-sm font-medium text-slate-500">
              {isSuccess ? (
                <>
                  Status for{" "}
                  <span className="font-extrabold text-slate-700">
                    Order #{orderId}
                  </span>{" "}
                  has been updated successfully.
                </>
              ) : isLoading ? (
                <>
                  Updating status for{" "}
                  <span className="font-extrabold text-slate-700">
                    Order #{orderId}
                  </span>
                  . Please wait...
                </>
              ) : (
                <>
                  You are about to update the status for{" "}
                  <span className="font-extrabold text-slate-700">
                    Order #{orderId}
                  </span>
                  . This action will be recorded in the event timeline and the
                  customer will receive an automated notification.
                </>
              )}
            </p>

            {message ? (
              <p className="mt-2 text-xs font-medium text-slate-400">
                {message}
              </p>
            ) : null}
          </div>

          <div className="mt-6 flex justify-center">
            <div className="mx-4 flex items-center gap-4 rounded-full bg-slate-100 px-4 py-3">
              {toStatus === "processing" ? (
                <span className={pillClass(true)}>{labelOf("processing")}</span>
              ) : toStatus === "shipped" ? (
                <>
                  <span className={pillClass(false)}>
                    {labelOf("processing")}
                  </span>
                  <span className="text-2xl font-bold leading-none text-slate-500">
                    →
                  </span>
                  <span className={pillClass(true)}>{labelOf("shipped")}</span>
                </>
              ) : (
                <>
                  <span className={pillClass(false)}>{labelOf("shipped")}</span>
                  <span className="text-2xl font-bold leading-none text-slate-500">
                    →
                  </span>
                  <span className={pillClass(true)}>{labelOf("received")}</span>
                </>
              )}
            </div>
          </div>

          <div className="mt-7 space-y-3">
            {isSuccess ? (
              <button
                type="button"
                onClick={onClose}
                className={[
                  "w-full rounded-full px-6 py-3 text-sm font-extrabold text-white",
                  "bg-[var(--primary)] hover:bg-[var(--primary-hover)] active:scale-[0.99]",
                ].join(" ")}
              >
                Close
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    if (!isLoading) {
                      void onConfirm();
                    }
                  }}
                  disabled={isLoading}
                  className={[
                    "w-full rounded-full px-6 py-3 text-sm font-extrabold text-white",
                    "bg-[var(--primary)] hover:bg-[var(--primary-hover)] active:scale-[0.99]",
                    "disabled:cursor-not-allowed disabled:opacity-60",
                  ].join(" ")}
                >
                  {isLoading ? "Updating..." : "Confirm & Update Status"}
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="w-full text-sm font-semibold text-slate-400 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
