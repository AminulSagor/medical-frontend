"use client";

import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

type OrderDetailsHeaderProps = {
  orderId: string;
  placedAt: ReactNode;
  paymentStatus?: string;
  fulfillmentStatus?: string;
};

function pillBase() {
  return "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold";
}

function getStatusClasses(status?: string) {
  const normalized = status?.toLowerCase().trim();

  const statusMap: Record<string, string> = {
    paid: "border-[var(--primary)]/20 bg-[var(--primary-50)] text-[var(--primary)]",
    pending: "border-amber-200 bg-amber-50 text-amber-700",
    refunded: "border-red-200 bg-red-50 text-red-700",

    fulfilled: "border-emerald-200 bg-emerald-50 text-emerald-700",
    unfulfilled: "border-amber-200 bg-amber-50 text-amber-700",
    processing: "border-sky-200 bg-sky-50 text-sky-700",
    shipped: "border-indigo-200 bg-indigo-50 text-indigo-700",
    received: "border-teal-200 bg-teal-50 text-teal-700",
    closed: "border-slate-200 bg-slate-100 text-slate-700",
  };

  return (
    statusMap[normalized ?? ""] ??
    "border-slate-200 bg-slate-100 text-slate-700"
  );
}

function getStatusDotClasses(status?: string) {
  const normalized = status?.toLowerCase().trim();

  const dotMap: Record<string, string> = {
    paid: "bg-[var(--primary)]",
    pending: "bg-amber-500",
    refunded: "bg-red-500",

    fulfilled: "bg-emerald-500",
    unfulfilled: "bg-amber-500",
    processing: "bg-sky-500",
    shipped: "bg-indigo-500",
    received: "bg-teal-500",
    closed: "bg-slate-500",
  };

  return dotMap[normalized ?? ""] ?? "bg-slate-500";
}

function StatusPill({ status }: { status?: string }) {
  if (!status) return null;

  return (
    <span className={[pillBase(), getStatusClasses(status)].join(" ")}>
      <span className={`h-2 w-2 rounded-full ${getStatusDotClasses(status)}`} />
      {status}
    </span>
  );
}

export default function OrderDetailsHeader({
  orderId,
  placedAt,
  paymentStatus,
  fulfillmentStatus,
}: OrderDetailsHeaderProps) {
  const router = useRouter();
  const cleanId = (orderId ?? "").trim().replace(/^#/, "");

  return (
    <div className="w-full space-y-2">
      <div className="flex w-full items-center gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white hover:bg-slate-50"
        >
          <ArrowLeft size={18} className="text-[var(--primary)]" />
        </button>

        <div className="text-sm font-semibold text-slate-400">
          Orders <span className="mx-2">/</span>
          <span className="text-slate-900">{cleanId}</span>
        </div>
      </div>

      <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-extrabold text-slate-900">
          ORDER #{cleanId}
        </h1>

        {paymentStatus || fulfillmentStatus ? (
          <div className="shrink-0 sm:ml-auto">
            <div className="flex flex-wrap items-center gap-2">
              <StatusPill status={paymentStatus} />
              <StatusPill status={fulfillmentStatus} />
            </div>
          </div>
        ) : null}
      </div>

      <p className="text-sm font-semibold text-slate-500">{placedAt}</p>
    </div>
  );
}
