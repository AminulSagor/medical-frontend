"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarDays, CheckCircle2, ChevronDown, Truck } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import UpdateOrderStatusModal from "./update-order-status-modal";
import { OrderDetailsViewModel } from "../_utils/order-details.mapper";
import { updateAdminOrderStatus } from "@/service/admin/orders/order-status.service";
import type { AdminOrderStatus } from "@/types/admin/orders/order-status.types";

type OrderStatus = AdminOrderStatus;
type UpdateModalState = "confirm" | "loading" | "success";

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

function PanelHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between gap-3 px-6 pt-6">
      <h2 className="text-sm font-bold text-slate-900">{title}</h2>
    </div>
  );
}

function Divider() {
  return <div className="my-4 h-px bg-slate-200" />;
}

function PrimaryButton({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }) {
  return (
    <button
      {...props}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white",
        "bg-[var(--primary)] hover:bg-[var(--primary-hover)] active:scale-[0.99]",
        "disabled:opacity-60",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function StatusChoice({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex w-full items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold",
        active
          ? "border-transparent bg-[var(--primary)] text-white"
          : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50",
      ].join(" ")}
    >
      {icon}
      {label}
    </button>
  );
}

function getInitialSelectedDate(value: string): Date | undefined {
  if (!value) {
    return undefined;
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return undefined;
  }

  return parsedDate;
}

export default function OrderDetailsShippingDispatch({
  order,
}: {
  order: OrderDetailsViewModel;
}) {
  const [carrierOpen, setCarrierOpen] = useState(false);
  const [carrierHovered, setCarrierHovered] = useState<string | null>(null);
  const [openCalendar, setOpenCalendar] = useState(false);

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateModalState, setUpdateModalState] =
    useState<UpdateModalState>("confirm");
  const [updateMessage, setUpdateMessage] = useState("");

  const carrierWrapRef = useRef<HTMLDivElement | null>(null);
  const calendarWrapRef = useRef<HTMLDivElement | null>(null);

  const [carrier, setCarrier] = useState(() => order.shipping.carrier);
  const [tracking, setTracking] = useState(() => order.shipping.trackingNumber);
  const [notes, setNotes] = useState(() => order.shipping.notes);
  const [status, setStatus] = useState<OrderStatus>(
    () => order.shipping.status,
  );
  const [savedStatus, setSavedStatus] = useState<OrderStatus>(
    () => order.shipping.status,
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(() =>
    getInitialSelectedDate(order.shipping.estDeliveryDate),
  );

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node;

      if (carrierWrapRef.current && !carrierWrapRef.current.contains(target)) {
        setCarrierOpen(false);
        setCarrierHovered(null);
      }

      if (
        calendarWrapRef.current &&
        !calendarWrapRef.current.contains(target)
      ) {
        setOpenCalendar(false);
      }
    };

    document.addEventListener("mousedown", onDown);

    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const initialShipping = order.shipping;
  const selectedDateText = selectedDate
    ? format(selectedDate, "MM/dd/yyyy")
    : "";

  const isAnythingChanged =
    status !== savedStatus ||
    carrier !== initialShipping.carrier ||
    tracking !== initialShipping.trackingNumber ||
    selectedDateText !== initialShipping.estDeliveryDate ||
    notes !== initialShipping.notes;

  const isSaveDisabled = !isAnythingChanged;

  const handleCloseModal = () => {
    setIsUpdateModalOpen(false);
    setUpdateModalState("confirm");
    setUpdateMessage("");
  };

  const handleConfirmUpdate = async () => {
    try {
      setUpdateModalState("loading");
      setUpdateMessage("");

      const response = await updateAdminOrderStatus(order.id, {
        fromStatus: savedStatus,
        toStatus: status,
        notifyCustomer: true,
        note: notes?.trim() || "",
      });

      setSavedStatus(status);
      setUpdateModalState("success");
      setUpdateMessage(
        response?.message || "Order status updated successfully.",
      );
    } catch (error) {
      console.error("Failed to update order status:", error);
      setUpdateModalState("confirm");
      setUpdateMessage("Failed to update order status. Please try again.");
    }
  };

  return (
    <>
      <Panel>
        <PanelHeader title="Shipping & Dispatch" />

        <div className="px-6 pb-6 pt-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="text-[11px] font-bold uppercase tracking-wide text-slate-700">
                Carrier
              </div>

              <div ref={carrierWrapRef} className="relative mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setCarrierOpen((prev) => {
                      const next = !prev;

                      if (!next) {
                        setCarrierHovered(null);
                      }

                      return next;
                    });
                  }}
                  className={[
                    "flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white",
                    "px-3 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50",
                  ].join(" ")}
                >
                  <span>{carrier || "Select carrier"}</span>
                  <ChevronDown size={18} className="text-slate-400" />
                </button>

                {carrierOpen && (
                  <div
                    onMouseLeave={() => setCarrierHovered(null)}
                    className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
                  >
                    {["FedEx", "DHL", "UPS"].map((option) => {
                      const active = carrier === option;
                      const isHighlighted = carrierHovered
                        ? carrierHovered === option
                        : active;

                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => {
                            setCarrier(option);
                            setCarrierHovered(null);
                            setCarrierOpen(false);
                          }}
                          onMouseEnter={() => setCarrierHovered(option)}
                          className={[
                            "block w-full cursor-pointer px-4 py-2 text-left text-sm",
                            isHighlighted
                              ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                              : "text-slate-700",
                          ].join(" ")}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="text-[11px] font-bold uppercase tracking-wide text-slate-700">
                Tracking Number
              </div>
              <input
                value={tracking}
                onChange={(e) => setTracking(e.target.value)}
                placeholder="Tracking number"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-[var(--primary)]"
              />
            </div>

            <div className="lg:col-span-4">
              <div className="text-[11px] font-bold uppercase tracking-wide text-slate-700">
                Est. Delivery Date
              </div>

              <div ref={calendarWrapRef} className="relative mt-2">
                <button
                  type="button"
                  onClick={() => setOpenCalendar((prev) => !prev)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 pr-10 text-left text-sm font-semibold text-slate-800 outline-none focus:border-[var(--primary)]"
                >
                  {selectedDate
                    ? format(selectedDate, "MM/dd/yyyy")
                    : "mm/dd/yyyy"}
                </button>

                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                  <CalendarDays size={18} />
                </span>

                {openCalendar && (
                  <div className="absolute z-50 mt-2 w-[320px] rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl">
                    <DayPicker
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date);
                        setOpenCalendar(false);
                      }}
                      showOutsideDays
                      classNames={{
                        months: "flex flex-col",
                        month: "space-y-3",
                        caption: "flex items-center justify-between px-1",
                        caption_label: "text-sm font-bold text-slate-900",
                        nav: "flex items-center gap-2",
                        nav_button:
                          "h-8 w-8 grid place-items-center rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                        nav_button_previous: "",
                        nav_button_next: "",
                        table: "w-full table-fixed border-collapse table",
                        head_row: "table-row",
                        head_cell:
                          "table-cell w-10 pb-2 text-center text-[11px] font-semibold text-slate-500",
                        row: "table-row",
                        cell: "table-cell p-0 text-center align-middle",
                        day: "mx-auto grid h-9 w-9 place-items-center rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-100 cursor-pointer",
                        day_selected:
                          "bg-[var(--primary)] text-white hover:bg-[var(--primary)]",
                        day_today: "ring-1 ring-[var(--primary)]",
                        day_outside: "text-slate-300",
                        day_disabled:
                          "text-slate-300 opacity-50 cursor-not-allowed",
                        month_grid: "w-full",
                        weekdays: "grid grid-cols-7",
                        weekday:
                          "text-center text-[11px] font-semibold text-slate-500",
                        weeks: "grid gap-1",
                        week: "grid grid-cols-7",
                        day_button:
                          "mx-auto grid h-9 w-9 place-items-center rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-100 cursor-pointer",
                        selected:
                          "bg-[var(--primary)] text-white hover:bg-[var(--primary)]",
                        today: "ring-1 ring-[var(--primary)]",
                        outside: "text-slate-300",
                        disabled:
                          "text-slate-300 opacity-50 cursor-not-allowed",
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-12">
              <div className="text-[11px] font-bold uppercase tracking-wide text-slate-700">
                Shipping Notes
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Special delivery instructions or internal courier notes..."
                className="mt-2 min-h-24 w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-[var(--primary)]"
              />
            </div>
          </div>

          <Divider />

          <div className="space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-wide text-slate-700">
              Update Order Status
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <StatusChoice
                active={status === "processing"}
                icon={<Truck size={16} />}
                label="Processing"
                onClick={() => setStatus("processing")}
              />
              <StatusChoice
                active={status === "shipped"}
                icon={<Truck size={16} />}
                label="Shipped"
                onClick={() => setStatus("shipped")}
              />
              <StatusChoice
                active={status === "received"}
                icon={<Truck size={16} />}
                label="Received"
                onClick={() => setStatus("received")}
              />
            </div>

            <PrimaryButton
              className="mt-2 w-full"
              type="button"
              disabled={isSaveDisabled}
              onClick={() => {
                setUpdateModalState("confirm");
                setUpdateMessage("");
                setIsUpdateModalOpen(true);
              }}
            >
              <CheckCircle2 size={18} />
              UPDATE STATUS &amp; SAVE DETAILS
            </PrimaryButton>
          </div>
        </div>
      </Panel>

      <UpdateOrderStatusModal
        open={isUpdateModalOpen}
        orderId={order.id}
        fromStatus={savedStatus}
        toStatus={status}
        state={updateModalState}
        message={updateMessage}
        onClose={handleCloseModal}
        onConfirm={handleConfirmUpdate}
      />
    </>
  );
}
