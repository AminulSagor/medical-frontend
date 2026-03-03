"use client";

import Image from "next/image";
import { useMemo } from "react";
import { Plus, MapPin } from "lucide-react";
import { paymentMethodsSchema } from "@/schema/account-settings/payment-method-schema";
import type {
  PaymentCardItem,
  PaymentMethodsModel,
} from "@/types/account-settings/payment-method-type";

function cx(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(" ");
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
      {children}
    </div>
  );
}

function CardRow({ item }: { item: PaymentCardItem }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4">
      <div className="grid h-12 w-14 place-items-center rounded-xl bg-slate-50 ring-1 ring-slate-100">
        {item.brandIconUrl ? (
          <Image
            src={item.brandIconUrl}
            alt={item.brandLabel}
            width={26}
            height={18}
            className="h-auto w-auto"
          />
        ) : (
          <div className="h-4 w-8 rounded bg-slate-200" />
        )}
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <div className="text-[14px] font-extrabold text-slate-900">
            {item.brandLabel} ending in {item.last4}
          </div>

          {item.isDefault ? (
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold tracking-wide text-emerald-700">
              DEFAULT
            </span>
          ) : null}
        </div>

        <div className="mt-0.5 text-[12px] text-slate-500">
          Expires {item.expiresLabel}
        </div>
      </div>
    </div>
  );
}

export default function PaymentMethodsClient({ seed }: { seed: PaymentMethodsModel }) {
  const model = useMemo(() => {
    // validate seed (UI-only, but keeps it aligned for API later)
    const parsed = paymentMethodsSchema.safeParse(seed);
    if (parsed.success) return parsed.data;
    // fallback (should not happen)
    return seed;
  }, [seed]);

  function onAddNew() {
    // UI only for now
  }

  function onEditAddress() {
    // UI only for now
  }

  function onCancel() {
  }

  function onSave() {
  }

  return (
    <div>
      {/* Saved cards */}
      <SectionLabel>SAVED CARDS</SectionLabel>

      <div className="mt-3 space-y-4">
        {model.cards.map((c) => (
          <CardRow key={c.id} item={c} />
        ))}

        <button
          type="button"
          onClick={onAddNew}
          className={cx(
            "flex items-center gap-3 rounded-2xl border-2 border-dashed px-5 py-4",
            "border-slate-200 bg-white text-sky-600 hover:bg-slate-50/60"
          )}
        >
          <span className="grid h-8 w-8 place-items-center rounded-full bg-sky-50 ring-1 ring-sky-100">
            <Plus className="h-4 w-4" />
          </span>
          <span className="text-[13px] font-extrabold">
            Add New Payment Method
          </span>
        </button>
      </div>

      {/* divider */}
      <div className="my-8 h-px w-full bg-slate-100" />

      {/* Billing address */}
      <SectionLabel>BILLING ADDRESS</SectionLabel>

      <div className="mt-3 rounded-3xl border border-slate-200 bg-slate-50/40 px-6 py-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white ring-1 ring-slate-200 text-slate-500">
              <MapPin className="h-5 w-5" />
            </span>

            <div>
              <div className="text-[14px] font-extrabold text-slate-900">
                {model.billingAddress.name}
              </div>
              <div className="mt-1 text-[13px] text-slate-600">
                {model.billingAddress.line1}
              </div>
              <div className="mt-0.5 text-[13px] text-slate-600">
                {model.billingAddress.line2}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onEditAddress}
            className="text-[13px] font-extrabold text-sky-600 hover:opacity-90"
          >
            Edit Address
          </button>
        </div>
      </div>

      {/* Footer actions */}
      <div className="mt-10 border-t border-slate-200 pt-5">
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="h-10 rounded-xl px-4 text-[12px] font-semibold text-slate-500 hover:text-slate-700"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onSave}
            className="h-10 rounded-xl bg-sky-500 px-5 text-[12px] font-extrabold text-white shadow-[0_10px_18px_rgba(14,165,233,0.25)] hover:opacity-95"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}