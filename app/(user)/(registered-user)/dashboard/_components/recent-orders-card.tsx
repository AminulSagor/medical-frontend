// app/(dashboard)/_components/recent-orders-card.tsx
import Image from "next/image";
import Link from "next/link";

type OrderStatus = "Processing" | "Shipped" | "Delivered";

type RecentOrder = {
    id: string;
    title: string;
    orderNo: string;
    date: string;   // e.g. "Mar 10, 2024"
    amount: string; // e.g. "$125.00"
    status: OrderStatus;
    imageUrl: string; // public path like "/photos/Image.png"
};

export default function RecentOrdersCard(props: { items?: RecentOrder[] }) {
    const items: RecentOrder[] =
        props.items ??
        [
            {
                id: "1",
                title: "Laryngoscope Blade Size 3",
                orderNo: "#ORD-8829",
                date: "Mar 10, 2024",
                amount: "$125.00",
                status: "Processing",
                imageUrl: "/photos/Image.png",
            },
            {
                id: "2",
                title: "Littmann Cardiology IV",
                orderNo: "#ORD-8812",
                date: "Mar 05, 2024",
                amount: "$189.99",
                status: "Shipped",
                imageUrl: "/photos/Image.png",
            },
            {
                id: "3",
                title: "Clinical Anesthesia, 9th Ed.",
                orderNo: "#ORD-8790",
                date: "Feb 28, 2024",
                amount: "$110.50",
                status: "Delivered",
                imageUrl: "/photos/Image.png",
            },
            {
                id: "4",
                title: "Clinical Anesthesia, 9th Ed.",
                orderNo: "#ORD-8790",
                date: "Feb 28, 2024",
                amount: "$110.50",
                status: "Delivered",
                imageUrl: "/photos/Image.png",
            },
            {
                id: "5",
                title: "Clinical Anesthesia, 9th Ed.",
                orderNo: "#ORD-8790",
                date: "Feb 28, 2024",
                amount: "$110.50",
                status: "Delivered",
                imageUrl: "/photos/Image.png",
            },
            {
                id: "6",
                title: "Clinical Anesthesia, 9th Ed.",
                orderNo: "#ORD-8790",
                date: "Feb 28, 2024",
                amount: "$110.50",
                status: "Delivered",
                imageUrl: "/photos/Image.png",
            },
            {
                id: "7",
                title: "Clinical Anesthesia, 9th Ed.",
                orderNo: "#ORD-8790",
                date: "Feb 28, 2024",
                amount: "$110.50",
                status: "Delivered",
                imageUrl: "/photos/Image.png",
            },
        ];

    return (
        <section className="-mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_28px_rgba(15,23,42,0.06)]">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="grid h-8 w-8 place-items-center rounded-xl bg-slate-50 ring-1 ring-slate-200">
                        <Image
                            src="/icons/shopping.png"
                            alt="Orders"
                            width={16}
                            height={16}
                            className="opacity-80"
                        />
                    </span>

                    <h2 className="text-sm font-semibold text-slate-900">Recent Orders</h2>
                </div>

                <Link
                    href="#"
                    className="text-[11px] font-medium text-sky-600 hover:text-sky-700 hover:underline"
                >
                    View All
                </Link>
            </div>

            {/* List */}
            <div className="mt-4 space-y-3">
                {items.map((o) => (
                    <OrderRow key={o.id} order={o} />
                ))}
            </div>

        </section>
    );
}

function OrderRow({ order }: { order: RecentOrder }) {
    const badge = getBadge(order.status);

    return (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200/70 bg-white px-4 py-3 shadow-sm">

            {/* Left */}
            <div className="flex min-w-0 items-center gap-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-slate-100 ring-1 ring-slate-200">
                    <Image
                        src={order.imageUrl}
                        alt={order.title}
                        fill
                        className="object-cover"
                    />
                </div>

                <div className="min-w-0">
                    <div className="truncate text-[12px] font-semibold text-slate-900">
                        {order.title}
                    </div>
                    <div className="text-[10px] text-slate-500">{order.orderNo}</div>
                </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-6">
                <div className="text-right">
                    <div className="text-[10px] text-slate-500">{order.date}</div>
                    <div className="text-[12px] font-semibold text-slate-900">
                        {order.amount}
                    </div>
                </div>

                <span
                    className={[
                        "inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold ring-1",
                        badge.className,
                    ].join(" ")}
                >
                    {order.status}
                </span>
            </div>
        </div>
    );
}

function getBadge(status: OrderStatus): { className: string } {
    if (status === "Processing") {
        return { className: "bg-sky-50 text-sky-700 ring-sky-200" };
    }
    if (status === "Shipped") {
        return { className: "bg-emerald-50 text-emerald-700 ring-emerald-200" };
    }
    return { className: "bg-slate-50 text-slate-700 ring-slate-200" };
}
