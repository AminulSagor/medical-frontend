"use client";

import React, { useState } from "react";
import { ShoppingCart, Mail } from "lucide-react";
import OrdersTable from "./orders-table";
import NewslettersTable from "./newsletters-table";
import { SubscriberProfile } from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/subscribers/subscriber-profile/types/subscriber-profile.type";

type TabKey = "orders" | "newsletters";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function TabButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "relative pb-3 text-sm font-semibold transition",
        active ? "text-[#0e8f86]" : "text-slate-500 hover:text-slate-700",
      )}
    >
      {label}
      {active ? (
        <span className="absolute left-0 right-0 -bottom-[1px] h-[2px] rounded-full bg-[#0e8f86]" />
      ) : null}
    </button>
  );
}

export default function SubscriberHistory({
  id,
}: {
  id: string;
}) {
  const [tab, setTab] = useState<TabKey>("orders");

  const isOrders = tab === "orders";

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eefcfb] text-[#0e8f86]">
            {isOrders ? <ShoppingCart size={18} /> : <Mail size={18} />}
          </div>

          <div>
            <p className="text-[16px] font-semibold text-slate-800">
              {isOrders ? "Order History" : "Newsletter History"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-8 border-b border-slate-100">
        <TabButton
          active={tab === "orders"}
          label="Orders"
          onClick={() => setTab("orders")}
        />
        <TabButton
          active={tab === "newsletters"}
          label="Newsletters"
          onClick={() => setTab("newsletters")}
        />
      </div>

      <div className="mt-5">
        {tab === "orders" ? (
          <OrdersTable id={id} />
        ) : (
          <NewslettersTable id={id} />
        )}
      </div>
    </section>
  );
}
