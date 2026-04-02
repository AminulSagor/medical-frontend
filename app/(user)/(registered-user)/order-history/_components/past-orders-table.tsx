// app/(dashboard)/_components/past-orders-table.tsx
import Image from "next/image";
import Link from "next/link";
import {
    Search,
    ChevronDown,
    SlidersHorizontal,
    RotateCcw,
    Eye,
    Copy,
    ShoppingCart,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

type OrderStatus = "Processing" | "Shipped" | "Delivered";

type PastOrder = {
    id: string;
    title: string;
    orderNo: string;
    dateOrdered: string; // e.g. "Today, Oct 24"
    qtyLabel: string; // e.g. "3 items"
    status: OrderStatus;
    total: string; // e.g. "$120.00"
    imageUrl: string; // "/photos/Image.png"
    itemsBadge?: string; // e.g. "+2 items"
};

export default function PastOrdersTable(props: { items?: PastOrder[] }) {
    const items: PastOrder[] =
        props.items ??
        [
            {
                id: "1",
                title: "Disposable Laryngoscope Blades (Box of 20) + 2 other items",
                orderNo: "#ORD-8829",
                dateOrdered: "Today, Oct 24",
                qtyLabel: "3 items",
                status: "Processing",
                total: "$120.00",
                imageUrl: "/photos/Image.png",
                itemsBadge: "+2 items",
            },
            {
                id: "2",
                title: "Adult Airway Card + 1 other item",
                orderNo: "#ORD-8742",
                dateOrdered: "Oct 12, 2024",
                qtyLabel: "2 items",
                status: "Shipped",
                total: "$49.00",
                imageUrl: "/photos/Image.png",
                itemsBadge: "+1 item",
            },
            {
                id: "3",
                title: "Sterile Nitrile Gloves (Box 100) + 4 other items",
                orderNo: "#ORD-8561",
                dateOrdered: "Sep 28, 2024",
                qtyLabel: "5 items",
                status: "Delivered",
                total: "$94.95",
                imageUrl: "/photos/Image.png",
                itemsBadge: "+4 items",
            },
            {
                id: "4",
                title: "Littmann Classic III Stethoscope",
                orderNo: "#ORD-8402",
                dateOrdered: "Sep 15, 2024",
                qtyLabel: "1 item",
                status: "Delivered",
                total: "$105.00",
                imageUrl: "/photos/Image.png",
            },
        ];

    return (
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_28px_rgba(15,23,42,0.06)]">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-slate-900">Past Orders</h2>

                <Link
                    href="#"
                    className="text-[11px] font-medium text-sky-600 hover:text-sky-700 hover:underline"
                >
                    View All History
                </Link>
            </div>

            {/* Filters row */}
            <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                {/* Search */}
                <div className="relative w-full lg:max-w-[560px]">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        placeholder="Search Order #, Product Name, or SKU"
                        className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                    />
                </div>

                {/* Dropdowns + reset */}
                <div className="flex flex-wrap items-center gap-2">
                    <DropdownButton label="Past 3 Months" leftIcon={<span />} />
                    <DropdownButton
                        label="Order Status"
                        rightIcon={<SlidersHorizontal className="h-4 w-4" />}
                    />
                    <button
                        type="button"
                        className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                    >
                        <RotateCcw className="h-4 w-4" />
                        Reset
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="mt-4 overflow-hidden rounded-xl border border-slate-200/70">
                <table className="w-full text-left">
                    <thead className="bg-slate-50">
                        <tr className="text-[10px] font-semibold tracking-wider text-slate-500">
                            <th className="px-4 py-3">ITEM / DETAILS</th>
                            <th className="px-4 py-3">DATE ORDERED</th>
                            <th className="px-4 py-3">QTY</th>
                            <th className="px-4 py-3">STATUS</th>
                            <th className="px-4 py-3">TOTAL</th>
                            <th className="px-4 py-3 text-right">ACTIONS</th>
                        </tr>
                    </thead>

                    <tbody>
                        {items.map((o, idx) => (
                            <tr key={o.id} className="bg-white">
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="relative h-11 w-11 overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200">
                                            <Image src={o.imageUrl} alt={o.title} fill className="object-cover" />
                                            {o.itemsBadge ? (
                                                <span className="absolute left-1 top-1 rounded-full bg-sky-500 px-2 py-0.5 text-[9px] font-semibold text-white">
                                                    {o.itemsBadge}
                                                </span>
                                            ) : null}
                                        </div>

                                        <div className="min-w-0">
                                            <div className="truncate text-[12px] font-semibold text-slate-900">
                                                {o.title}
                                            </div>
                                            <div className="text-[10px] text-slate-500">
                                                Order No: <span className="font-medium">{o.orderNo}</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                <td className="px-4 py-4 text-[11px] text-slate-600">{o.dateOrdered}</td>

                                <td className="px-4 py-4 text-[11px] text-slate-600">{o.qtyLabel}</td>

                                <td className="px-4 py-4">
                                    <StatusPill status={o.status} />
                                </td>

                                <td className="px-4 py-4 text-[12px] font-semibold text-slate-900">
                                    {o.total}
                                </td>

                                <td className="px-4 py-4">
                                    <div className="flex justify-end gap-2 text-slate-500">
                                        <ActionIconButton label="View">
                                            <Eye className="h-4 w-4" />
                                        </ActionIconButton>
                                        <ActionIconButton label="Copy">
                                            <Copy className="h-4 w-4" />
                                        </ActionIconButton>
                                        <ActionIconButton label="Reorder">
                                            <ShoppingCart className="h-4 w-4" />
                                        </ActionIconButton>
                                    </div>
                                </td>

                                {idx !== items.length - 1 ? null : null}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer / Pagination */}
            <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="text-[11px] text-slate-500">Showing 1 to 4 of 25 orders</div>

                <div className="flex items-center gap-2">
                    <button className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] text-slate-500 hover:bg-slate-100">
                        <ChevronLeft className="h-4 w-4" /> Previous
                    </button>

                    <PagePill active>1</PagePill>
                    <PagePill>2</PagePill>
                    <PagePill>3</PagePill>
                    <span className="px-1 text-slate-400">…</span>
                    <PagePill>7</PagePill>

                    <button className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] text-slate-500 hover:bg-slate-100">
                        Next <ChevronRight className="h-4 w-4" />
                    </button>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <span>Go to page</span>
                    <input
                        defaultValue="1"
                        className="h-8 w-12 rounded-lg border border-slate-200 bg-white px-2 text-[11px] text-slate-900 outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                    />
                </div>
            </div>
        </section>
    );
}

function DropdownButton({
    label,
    leftIcon,
    rightIcon,
}: {
    label: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}) {
    return (
        <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-100"
        >
            {leftIcon ? <span className="text-slate-400">{leftIcon}</span> : null}
            <span>{label}</span>
            <span className="ml-2 text-slate-400">{rightIcon ?? <ChevronDown className="h-4 w-4" />}</span>
        </button>
    );
}

function StatusPill({ status }: { status: OrderStatus }) {
    const style =
        status === "Processing"
            ? "bg-sky-50 text-sky-700 ring-sky-200"
            : status === "Shipped"
                ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                : "bg-slate-50 text-slate-700 ring-slate-200";

    return (
        <span
            className={[
                "inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-semibold ring-1",
                style,
            ].join(" ")}
        >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {status}
        </span>
    );
}

function ActionIconButton({
    children,
    label,
}: {
    children: React.ReactNode;
    label: string;
}) {
    return (
        <button
            type="button"
            aria-label={label}
            className="grid h-9 w-9 place-items-center rounded-lg hover:bg-slate-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-100"
        >
            {children}
        </button>
    );
}

function PagePill({
    children,
    active,
}: {
    children: React.ReactNode;
    active?: boolean;
}) {
    return (
        <button
            type="button"
            className={[
                "grid h-8 w-8 place-items-center rounded-lg text-[11px] font-semibold",
                active
                    ? "bg-sky-500 text-white shadow-[0_10px_20px_rgba(2,132,199,0.20)]"
                    : "text-slate-600 hover:bg-slate-100",
            ].join(" ")}
        >
            {children}
        </button>
    );
}
