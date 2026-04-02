"use client";

import { useMemo, useState } from "react";
import OrdersHeader from "./_components/orders-header";
import OrderStats from "./_components/order-stats";
import OrdersToolbar from "./_components/orders-toolbar";
import OrdersTable, {
    type OrderRow,
    type FulfillmentStatus,
} from "./_components/orders-table";

const PAGE_SIZE = 10;

const MOCK: OrderRow[] = [
    { id: "#ORD-2026-001", date: "Oct 24, 2026", customer: "Sarah Jenkins", type: "product", paymentStatus: "paid", fulfillment: "shipped", total: "$145.00" },
    { id: "#ORD-2026-002", date: "Oct 23, 2026", customer: "Michael Chen", type: "course", paymentStatus: "pending", fulfillment: "processing", total: "$2,150.00" },
    { id: "#ORD-2026-003", date: "Oct 23, 2026", customer: "Robert Taylor", type: "product", paymentStatus: "paid", fulfillment: "shipped", total: "$89.95" },
    { id: "#ORD-2026-004", date: "Oct 22, 2026", customer: "Emily Davis", type: "product", paymentStatus: "refunded", fulfillment: "received", total: "$120.00" },

    { id: "#ORD-2026-005", date: "Oct 22, 2026", customer: "David Wilson", type: "course", paymentStatus: "paid", fulfillment: "received", total: "$275.00" },
    { id: "#ORD-2026-006", date: "Oct 21, 2026", customer: "Sophia Brown", type: "product", paymentStatus: "pending", fulfillment: "processing", total: "$49.99" },
    { id: "#ORD-2026-007", date: "Oct 21, 2026", customer: "James Anderson", type: "product", paymentStatus: "paid", fulfillment: "shipped", total: "$310.00" },
    { id: "#ORD-2026-008", date: "Oct 20, 2026", customer: "Olivia Martinez", type: "course", paymentStatus: "paid", fulfillment: "received", total: "$1,200.00" },
    { id: "#ORD-2026-009", date: "Oct 20, 2026", customer: "Noah Thomas", type: "product", paymentStatus: "pending", fulfillment: "processing", total: "$79.50" },
    { id: "#ORD-2026-010", date: "Oct 19, 2026", customer: "Ava Garcia", type: "product", paymentStatus: "paid", fulfillment: "shipped", total: "$59.00" },

    { id: "#ORD-2026-011", date: "Oct 19, 2026", customer: "Liam Taylor", type: "course", paymentStatus: "refunded", fulfillment: "received", total: "$650.00" },
    { id: "#ORD-2026-012", date: "Oct 18, 2026", customer: "Mia Johnson", type: "product", paymentStatus: "paid", fulfillment: "shipped", total: "$99.99" },
    { id: "#ORD-2026-013", date: "Oct 18, 2026", customer: "Ethan Lee", type: "product", paymentStatus: "pending", fulfillment: "processing", total: "$210.00" },
    { id: "#ORD-2026-014", date: "Oct 17, 2026", customer: "Isabella Clark", type: "course", paymentStatus: "paid", fulfillment: "received", total: "$899.00" },
    { id: "#ORD-2026-015", date: "Oct 17, 2026", customer: "Logan Walker", type: "product", paymentStatus: "paid", fulfillment: "shipped", total: "$35.00" },
];

export default function OrdersAndSalesPage() {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<"all" | FulfillmentStatus>("all");

    // pagination state
    const [page, setPage] = useState(1);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();

        return MOCK.filter((r) => {
            const matchesSearch =
                !q ||
                r.id.toLowerCase().includes(q) ||
                r.customer.toLowerCase().includes(q);

            const matchesStatus = status === "all" ? true : r.fulfillment === status;

            return matchesSearch && matchesStatus;
        });
    }, [search, status]);

    // reset page if filter reduces results
    const totalCount = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);

    const pagedRows = useMemo(() => {
        const start = (safePage - 1) * PAGE_SIZE;
        return filtered.slice(start, start + PAGE_SIZE);
    }, [filtered, safePage]);

    return (
        <div className="space-y-6">
            {/* ✅ HEADER + ACTIONS IN ONE ROW (like pic 2) */}
            <div className="flex items-end justify-between gap-4">
                <OrdersHeader />

                <div className="shrink-0">
                    <OrdersToolbar
                        onDownload={() => console.log("download csv")}
                        onNewOrder={() => console.log("new order")}
                    />
                </div>
            </div>

            <OrderStats />

            {/* ✅ CARD ONLY CONTAINS TABLE */}
            <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200 shadow-sm">
                <OrdersTable
                    rows={pagedRows}
                    search={search}
                    onSearchChange={(v) => {
                        setSearch(v);
                        setPage(1);
                    }}
                    status={status}
                    onStatusChange={(v) => {
                        setStatus(v);
                        setPage(1);
                    }}
                    page={safePage}
                    pageSize={PAGE_SIZE}
                    totalCount={totalCount}
                    onPageChange={setPage}
                />
            </div>
        </div>
    );
}