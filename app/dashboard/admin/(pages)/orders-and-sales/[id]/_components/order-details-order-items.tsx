"use client";

import { useState } from "react";
import { Printer } from "lucide-react";
import PrintOrderSlipModal from "./print-order-slip-modal";
import { money, OrderDetailsViewModel } from "../_utils/order-details.mapper";

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

function PanelHeader({
  title,
  right,
}: {
  title: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-6 pt-6">
      <h2 className="text-sm font-bold text-slate-900">{title}</h2>
      {right}
    </div>
  );
}

function Divider() {
  return <div className="my-4 h-px bg-slate-200" />;
}

function GhostButton({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }) {
  return (
    <button
      {...props}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800",
        "hover:bg-slate-100 active:scale-[0.99]",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export default function OrderDetailsOrderItems({
  order,
}: {
  order: OrderDetailsViewModel;
}) {
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  return (
    <>
      <Panel>
        <PanelHeader
          title="Order Items"
          right={
            <GhostButton
              type="button"
              onClick={() => setIsPrintModalOpen(true)}
            >
              <Printer size={16} />
              Print Order Slip
            </GhostButton>
          }
        />

        <div className="px-6 pb-6 pt-4">
          <div className="grid grid-cols-12 gap-2 px-2 text-[10px] font-bold uppercase tracking-wide text-slate-400">
            <div className="col-span-6">Product</div>
            <div className="col-span-2 text-right">Price</div>
            <div className="col-span-2 text-right">Qty</div>
            <div className="col-span-2 text-right">Total</div>
          </div>

          <Divider />

          <div className="space-y-4">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-12 items-center gap-2 rounded-xl px-2 py-2 hover:bg-slate-50"
              >
                <div className="col-span-6 flex items-center gap-3">
                  <div className="h-10 w-10 overflow-hidden rounded-xl bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imageUrl ?? "/photos/image.png"}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold text-slate-900">
                      {item.name}
                    </div>
                    <div className="text-xs font-semibold text-slate-400">
                      SKU: {item.sku}
                    </div>
                  </div>
                </div>

                <div className="col-span-2 text-right text-sm font-semibold text-slate-700">
                  {money(item.price)}
                </div>
                <div className="col-span-2 text-right text-sm font-semibold text-slate-700">
                  {item.qty}
                </div>
                <div className="col-span-2 text-right text-sm font-bold text-slate-900">
                  {money(item.total)}
                </div>
              </div>
            ))}
          </div>

          <Divider />

          <div className="flex flex-col gap-2 md:items-end">
            <div className="w-full max-w-[260px] space-y-2 text-sm">
              <div className="flex items-center justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800">
                  {money(order.pricing.subtotal)}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span>Shipping (Standard)</span>
                <span className="font-semibold text-slate-800">
                  {money(order.pricing.shipping)}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span>Tax</span>
                <span className="font-semibold text-slate-800">
                  {money(order.pricing.tax)}
                </span>
              </div>

              <Divider />

              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900">
                  Grand Total
                </span>
                <span className="text-lg font-extrabold text-[var(--primary)]">
                  {money(order.pricing.grandTotal)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Panel>

      <PrintOrderSlipModal
        open={isPrintModalOpen}
        orderId={order.id}
        onClose={() => setIsPrintModalOpen(false)}
      />
    </>
  );
}
