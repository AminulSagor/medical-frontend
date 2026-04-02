"use client";

import React, { useMemo, useEffect, useRef, useState } from "react";
import {
    Mail,
    Phone,
    User,
    Truck,
    Printer,
    MapPin,
    CheckCircle2,
    CreditCard,
    ShoppingCart,
    Undo2,
    ChevronDown,
    CalendarDays,
} from "lucide-react";
import OrderDetailsHeader from "./order-details-header";
import { usePathname } from "next/navigation";
import UpdateOrderStatusModal from "./update-order-status-modal";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";


type OrderStatus = "processing" | "shipped" | "received";
type PaymentStatus = "paid" | "unpaid";
type FulfillmentStatus = "fulfilled" | "unfulfilled";

type OrderItem = {
    id: string;
    name: string;
    sku: string;
    price: number;
    qty: number;
    imageUrl?: string;
};

type TimelineItem = {
    id: string;
    title: string;
    at: string;
};

type OrderDetails = {
    id: string;
    placedAt: string;
    paymentStatus: PaymentStatus;
    fulfillmentStatus: FulfillmentStatus;

    customer: {
        name: string;
        subtitle: string;
        email: string;
        phone: string;
        addressLines: string[];
    };

    items: OrderItem[];

    shipping: {
        carrier: string;
        trackingNumber: string;
        estDeliveryDate: string;
        notes: string;
        status: OrderStatus;
    };

    pricing: {
        subtotal: number;
        shipping: number;
        tax: number;
    };

    timeline: TimelineItem[];
};

function money(n: number) {
    return `$${n.toFixed(2)}`;
}

function pillBase() {
    return "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold";
}

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

function IconField({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-full bg-slate-100 p-2 text-slate-700">
                {icon}
            </div>
            <div className="min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    {label}
                </div>
                <div className="truncate text-sm font-semibold text-slate-800">
                    {value}
                </div>
            </div>
        </div>
    );
}

function StatusPill({ payment }: { payment: PaymentStatus }) {
    if (payment === "paid") {
        return (
            <span className={[pillBase(), "border-[var(--primary)]/20 bg-[var(--primary-50)] text-[var(--primary)]"].join(" ")}>
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                PAID
            </span>
        );
    }
    return (
        <span className={[pillBase(), "border-amber-200 bg-amber-50 text-amber-700"].join(" ")}>
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            UNPAID
        </span>
    );
}

function FulfillmentPill({ status }: { status: FulfillmentStatus }) {
    if (status === "fulfilled") {
        return (
            <span className={[pillBase(), "border-emerald-200 bg-emerald-50 text-emerald-700"].join(" ")}>
                FULFILLED
            </span>
        );
    }
    return (
        <span className={[pillBase(), "border-amber-200 bg-amber-50 text-amber-700"].join(" ")}>
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            UNFULFILLED
        </span>
    );
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

function TimelineIcon({ title }: { title: string }) {
    const t = title.toLowerCase();

    if (t.includes("payment")) return <CreditCard size={18} />;
    if (t.includes("order")) return <ShoppingCart size={18} />;

    // fallback (if you add more timeline items later)
    return <ShoppingCart size={18} />;
}

export default function OrderDetailsClient({ id }: { id: string }) {
    const pathname = usePathname();
    const urlId = decodeURIComponent(pathname.split("/").filter(Boolean).pop() ?? "");
    const effectiveId = id?.trim() ? id.trim() : urlId;
    const [carrierOpen, setCarrierOpen] = useState(false);
    const [carrierHovered, setCarrierHovered] = useState<string | null>(null);
    const carrierWrapRef = useRef<HTMLDivElement | null>(null);
    const dateRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        const onDown = (e: MouseEvent) => {
            if (!carrierWrapRef.current) return;
            if (!carrierWrapRef.current.contains(e.target as Node)) setCarrierOpen(false);
        };
        document.addEventListener("mousedown", onDown);
        return () => document.removeEventListener("mousedown", onDown);
    }, []);

    useEffect(() => {
        if (!carrierOpen) setCarrierHovered(null);
    }, [carrierOpen]);

    const initial = useMemo<OrderDetails>(
        () => ({
            id: effectiveId,
            placedAt: "Placed on October 24, 2026 at 09:42 AM",
            paymentStatus: "paid",
            fulfillmentStatus: "unfulfilled",
            customer: {
                name: "Dr. Sarah Smith",
                subtitle: "Clinical Member since 2021",
                email: "s.smith@hospital.org",
                phone: "+1 (512) 555-0198",
                addressLines: [
                    "St. Jude Medical Center",
                    "Attn: Airway Lab, Room 402",
                    "1200 North Lamar Blvd",
                    "Austin, TX 78701",
                ],
            },
            items: [
                {
                    id: "1",
                    name: "Laryngeal Mask Airway (LMA)",
                    sku: "LMA-V5-S24",
                    price: 12,
                    qty: 2,
                    imageUrl: "/photos/laryngeal-mask-airway.png",
                },
                {
                    id: "2",
                    name: "Sterile Medical Lubricant",
                    sku: "SL-EL-80G",
                    price: 4.5,
                    qty: 1,
                    imageUrl: "/photos/sterile-medical-lubricant.png",
                },
            ],
            shipping: {
                carrier: "FedEx",
                trackingNumber: "1Z999AA101234...",
                estDeliveryDate: "",
                notes: "",
                status: "shipped",
            },
            pricing: {
                subtotal: 28.5,
                shipping: 0,
                tax: 1.7,
            },
            timeline: [
                { id: "t1", title: "Payment Authorized", at: "Oct 24, 2026 at 09:43 AM" },
                { id: "t2", title: "Order Placed", at: "Oct 24, 2026 at 09:42 AM" },
            ],
        }),
        [effectiveId]
    );

    const [carrier, setCarrier] = useState(initial.shipping.carrier);
    const [tracking, setTracking] = useState("");
    const [estDeliveryDate, setEstDeliveryDate] = useState(
        initial.shipping.estDeliveryDate
    );

    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const [openCalendar, setOpenCalendar] = useState(false);

    const [notes, setNotes] = useState(initial.shipping.notes);
    const [status, setStatus] = useState<OrderStatus>(initial.shipping.status);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

    // this is the “current saved” status (before user changes)
    const [savedStatus, setSavedStatus] = useState<OrderStatus>(initial.shipping.status);

    // keep savedStatus synced when order changes (id changes)
    useEffect(() => {
        setSavedStatus(initial.shipping.status);
    }, [effectiveId, initial.shipping.status]);

    const fromStatus = savedStatus;
    const initialShipping = initial.shipping;

    const isAnythingChanged =
        status !== fromStatus ||
        carrier !== initialShipping.carrier ||
        tracking !== initialShipping.trackingNumber ||
        estDeliveryDate !== initialShipping.estDeliveryDate ||
        notes !== initialShipping.notes; // notes empty is OK — only counts if changed

    const isSaveDisabled = !isAnythingChanged;

    const subtotal = initial.pricing.subtotal;
    const shippingCost = initial.pricing.shipping;
    const tax = initial.pricing.tax;
    const grandTotal = useMemo(
        () => subtotal + shippingCost + tax,
        [subtotal, shippingCost, tax]
    );

    function formatMMDDYYYY(estDeliveryDate: string): string | number | readonly string[] | undefined {
        throw new Error("Function not implemented.");
    }

    return (
        <div className="space-y-6">
            {/* Header (must match screenshot) */}
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <OrderDetailsHeader
                    orderId={effectiveId}
                    placedAt="Placed on October 24, 2026 at 09:42 AM"
                    right={
                        <>
                            <StatusPill payment={initial.paymentStatus} />
                            <FulfillmentPill status={initial.fulfillmentStatus} />
                        </>
                    }
                />
            </div>

            {/* Top grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="lg:col-span-8 space-y-6">
                    {/* Left: Order items */}
                    <Panel className="lg:col-span-8">
                        <PanelHeader
                            title="Order Items"
                            right={
                                <GhostButton type="button">
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
                                {initial.items.map((it) => {
                                    const total = it.price * it.qty;
                                    return (
                                        <div
                                            key={it.id}
                                            className="grid grid-cols-12 items-center gap-2 rounded-xl px-2 py-2 hover:bg-slate-50"
                                        >
                                            <div className="col-span-6 flex items-center gap-3">
                                                <div className="h-10 w-10 overflow-hidden rounded-xl bg-slate-100">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={it.imageUrl ?? "/photos/image.png"}
                                                        alt={it.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="truncate text-sm font-bold text-slate-900">
                                                        {it.name}
                                                    </div>
                                                    <div className="text-xs font-semibold text-slate-400">
                                                        SKU: {it.sku}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-span-2 text-right text-sm font-semibold text-slate-700">
                                                {money(it.price)}
                                            </div>
                                            <div className="col-span-2 text-right text-sm font-semibold text-slate-700">
                                                {it.qty}
                                            </div>
                                            <div className="col-span-2 text-right text-sm font-bold text-slate-900">
                                                {money(total)}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <Divider />

                            <div className="flex flex-col gap-2 md:items-end">
                                <div className="w-full max-w-[260px] space-y-2 text-sm">
                                    <div className="flex items-center justify-between text-slate-600">
                                        <span>Subtotal</span>
                                        <span className="font-semibold text-slate-800">
                                            {money(subtotal)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-slate-600">
                                        <span>Shipping (Standard)</span>
                                        <span className="font-semibold text-slate-800">
                                            {money(shippingCost)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-slate-600">
                                        <span>Tax (Texas 6%)</span>
                                        <span className="font-semibold text-slate-800">
                                            {money(tax)}
                                        </span>
                                    </div>

                                    <Divider />

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold text-slate-900">
                                            Grand Total
                                        </span>
                                        <span className="text-lg font-extrabold text-[var(--primary)]">
                                            {money(grandTotal)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Panel>

                    {/* Shipping & Dispatch (moved here) */}
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
                                            onClick={() => setCarrierOpen((v) => !v)}
                                            className={[
                                                "flex w-full items-center justify-between",
                                                "rounded-xl border border-slate-200 bg-white",
                                                "px-3 py-2.5 text-sm font-semibold text-slate-800",
                                                "cursor-pointer",
                                                "hover:bg-slate-50",
                                                "focus:outline-none focus:border-[var(--primary)]",
                                            ].join(" ")}
                                        >
                                            <span>{carrier}</span>
                                            <ChevronDown size={18} className="text-slate-400" />
                                        </button>

                                        {carrierOpen && (
                                            <div
                                                onMouseLeave={() => setCarrierHovered(null)}
                                                className={[
                                                    "absolute left-0 right-0 z-50 mt-2 overflow-hidden",
                                                    "rounded-xl border border-slate-200 bg-white shadow-lg",
                                                ].join(" ")}
                                            >
                                                {["FedEx", "DHL", "UPS"].map((opt) => {
                                                    const active = carrier === opt;
                                                    const isHighlighted = carrierHovered ? carrierHovered === opt : active;
                                                    return (
                                                        <button
                                                            key={opt}
                                                            type="button"
                                                            onClick={() => {
                                                                setCarrier(opt);
                                                                setCarrierHovered(null);
                                                                setCarrierOpen(false);
                                                            }}
                                                            onMouseEnter={() => setCarrierHovered(opt)}
                                                            className={[
                                                                "block w-full px-4 py-2 text-left text-sm",
                                                                "cursor-pointer",
                                                                isHighlighted
                                                                    ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                                                                    : "text-slate-700"
                                                            ].join(" ")}
                                                        >
                                                            {opt}
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
                                        placeholder={initial.shipping.trackingNumber}
                                        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-[var(--primary)]"
                                    />
                                </div>

                                <div className="lg:col-span-4">
                                    <div className="text-[11px] font-bold uppercase tracking-wide text-slate-700">
                                        Est. Delivery Date
                                    </div>

                                    <div className="relative mt-2">
                                        <button
                                            type="button"
                                            onClick={() => setOpenCalendar(!openCalendar)}
                                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 pr-10 text-left text-sm font-semibold text-slate-800 outline-none focus:border-[var(--primary)]"
                                        >
                                            {selectedDate ? format(selectedDate, "MM/dd/yyyy") : "mm/dd/yyyy"}
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
                                                        // ---- common ----
                                                        months: "flex flex-col",
                                                        month: "space-y-3",
                                                        caption: "flex items-center justify-between px-1",
                                                        caption_label: "text-sm font-bold text-slate-900",
                                                        nav: "flex items-center gap-2",
                                                        nav_button:
                                                            "h-8 w-8 grid place-items-center rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                                                        nav_button_previous: "",
                                                        nav_button_next: "",

                                                        // ---- v8 (table-based) ----
                                                        table: "w-full table-fixed border-collapse table",
                                                        head_row: "table-row",
                                                        head_cell:
                                                            "table-cell w-10 pb-2 text-center text-[11px] font-semibold text-slate-500",
                                                        row: "table-row",
                                                        cell: "table-cell p-0 text-center align-middle",
                                                        day: "mx-auto grid h-9 w-9 place-items-center rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-100 cursor-pointer",
                                                        day_selected: "bg-[var(--primary)] text-white hover:bg-[var(--primary)]",
                                                        day_today: "ring-1 ring-[var(--primary)]",
                                                        day_outside: "text-slate-300",
                                                        day_disabled: "text-slate-300 opacity-50 cursor-not-allowed",

                                                        // ---- v9 (div/grid-based) ----
                                                        month_grid: "w-full",
                                                        weekdays: "grid grid-cols-7",
                                                        weekday:
                                                            "text-center text-[11px] font-semibold text-slate-500",
                                                        weeks: "grid gap-1",
                                                        week: "grid grid-cols-7",
                                                        day_button:
                                                            "mx-auto grid h-9 w-9 place-items-center rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-100 cursor-pointer",
                                                        selected: "bg-[var(--primary)] text-white hover:bg-[var(--primary)]",
                                                        today: "ring-1 ring-[var(--primary)]",
                                                        outside: "text-slate-300",
                                                        disabled: "text-slate-300 opacity-50 cursor-not-allowed",
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="lg:col-span-12">
                                    <div className="text-[11px] font-bold uppercase tracking-wide text-slate-700">
                                        Shipping Notes{" "}
                                        <span className="ml-1 font-medium normal-case text-slate-300">
                                        </span>
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
                                    onClick={() => setIsUpdateModalOpen(true)}
                                >
                                    <CheckCircle2 size={18} />
                                    UPDATE STATUS &amp; SAVE DETAILS
                                </PrimaryButton>
                            </div>
                        </div>
                    </Panel>
                </div>

                {/* Right: Customer profile + timeline + refund */}
                <div className="space-y-6 lg:col-span-4">
                    <Panel>
                        <PanelHeader title="Customer Profile" />

                        <div className="px-6 pb-6 pt-4 space-y-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary-50)] text-[var(--primary)]">
                                    <User size={18} />
                                </div>

                                <div className="min-w-0">
                                    <div className="truncate text-sm font-extrabold text-[var(--primary)]">
                                        {initial.customer.name}
                                    </div>
                                    <div className="text-xs font-semibold text-slate-400">
                                        {initial.customer.subtitle}
                                    </div>
                                </div>
                            </div>

                            {/* underline like screenshot */}
                            <div className="h-px bg-slate-200" />

                            <div className="space-y-3">
                                <IconField icon={<Mail size={16} />} label="Email" value={initial.customer.email} />
                                <IconField icon={<Phone size={16} />} label="Phone" value={initial.customer.phone} />
                            </div>

                            {/* Shipping Address label OUTSIDE box + reduced gap */}
                            <div className="space-y-0.5">
                                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                                    <MapPin size={14} className="text-slate-400" />
                                    <span>Shipping Address</span>
                                </div>

                                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-2">
                                    <div className="space-y-1 text-sm font-semibold text-slate-700">
                                        {initial.customer.addressLines.map((l, idx) => (
                                            <div key={idx}>{l}</div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Panel>

                    <Panel>
                        <PanelHeader title="Event Timeline" />
                        <div className="px-6 pb-6 pt-4 space-y-3">
                            {initial.timeline.map((t, idx) => {
                                const isLast = idx === initial.timeline.length - 1;
                                return (
                                    <div key={t.id} className="flex items-start gap-3">
                                        {/* icon + connector */}
                                        <div className="relative mt-0.5 flex w-9 justify-center">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primary-50)] text-[var(--primary)]">
                                                <TimelineIcon title={t.title} />
                                            </div>

                                            {!isLast ? (
                                                <div className="absolute top-10 h-8 w-px bg-slate-200" />
                                            ) : null}
                                        </div>

                                        {/* text */}
                                        <div className="min-w-0">
                                            <div className="text-sm font-extrabold text-slate-900">{t.title}</div>
                                            <div className="text-xs font-semibold text-slate-400">{t.at}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Panel>

                    {/* Critical Actions */}
                    <Panel className="relative overflow-hidden rounded-2xl border border-[#e73508]/30 bg-gradient-to-br from-white via-white to-[#fff9f7] shadow-[0_12px_35px_rgba(231,53,8,0.12)] ring-1 ring-[#e73508]/20">
                        {/* 🔥 FULL BOX SOFT RED GLOW */}
                        <div className="pointer-events-none absolute inset-0 opacity-80 bg-[radial-gradient(circle_at_55%_45%,rgba(231,53,8,0.08),transparent_65%)]" />
                        {/* 🔥 TOP LEFT SOFT GLOW BLOB */}
                        <div className="pointer-events-none absolute left-6 top-6 h-24 w-24 rounded-full bg-[#e73508]/12 blur-3xl" />

                        <div className="relative px-6 py-6">
                            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#e73508]">
                                Critical Actions
                            </div>

                            <button
                                type="button"
                                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#e73508]/40 bg-white/70 px-4 py-3 text-sm font-bold text-[#e73508] hover:bg-[#e73508]/10 active:scale-[0.99]"
                            >
                                <Undo2 size={18} />
                                Issue Refund
                            </button>

                            <div className="mt-4 text-center text-xs italic font-medium text-[#e73508]/55">
                                Refunds require administrative override.
                            </div>
                        </div>
                    </Panel>
                </div>
            </div>

            <UpdateOrderStatusModal
                open={isUpdateModalOpen}
                orderId={effectiveId}
                fromStatus={fromStatus}
                toStatus={status}
                onClose={() => setIsUpdateModalOpen(false)}
                onConfirm={() => {
                    setSavedStatus(status);
                    setIsUpdateModalOpen(false);
                    console.log("Confirm update status:", {
                        orderId: effectiveId,
                        fromStatus,
                        toStatus: status,
                    });
                }}
            />
        </div>
    );
}