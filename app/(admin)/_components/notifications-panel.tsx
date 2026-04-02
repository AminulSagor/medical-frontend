"use client";

import Image from "next/image";
import { BookOpen, ShoppingCart, CloudCheck } from "lucide-react";

type NotificationType = "urgent" | "course" | "order" | "system";

type NotificationItem = {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    time: string;
};

const ITEMS: NotificationItem[] = [
    {
        id: "1",
        type: "urgent",
        title: "Urgent: Refund Requested",
        message:
            "Student: Michael Chen requested a refund for Advanced Airway.",
        time: "Just now",
    },
    {
        id: "2",
        type: "course",
        title: "Course Full: Advanced Airway",
        message: "Capacity reached for the upcoming clinical intensive.",
        time: "5 min ago",
    },
    {
        id: "3",
        type: "order",
        title: "New Order Received",
        message: "Order #2451 placed for 3x Laryngeal Masks.",
        time: "12 min ago",
    },
    {
        id: "4",
        type: "system",
        title: "System Update Completed",
        message: "Version 2.4.0 deployed. All clinical databases synced.",
        time: "1 hour ago",
    },
];

function IconBox({ type }: { type: NotificationType }) {
    const base =
        "grid h-11 w-11 place-items-center rounded-xl ring-1";

    if (type === "course") {
        return (
            <div className={`${base} bg-emerald-50 ring-emerald-100 text-emerald-600`}>
                <BookOpen size={18} />
            </div>
        );
    }
    if (type === "order") {
        return (
            <div className={`${base} bg-sky-50 ring-sky-100 text-sky-600`}>
                <ShoppingCart size={18} />
            </div>
        );
    }
    if (type === "system") {
        return (
            <div className={`${base} bg-slate-50 ring-slate-200 text-slate-600`}>
                <CloudCheck size={18} />
            </div>
        );
    }

    // urgent (avatar style)
    return (
        <div className="relative h-11 w-11 overflow-hidden rounded-full ring-1 ring-slate-200">
            <Image
                src="/photos/image.png"
                alt="Student"
                fill
                className="object-cover"
            />
            <span className="absolute right-0.5 top-0.5 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
        </div>
    );
}

export default function NotificationsPanel({
    onMarkAllRead,
    onViewAll,
}: {
    onMarkAllRead?: () => void;
    onViewAll?: () => void;
}) {
    return (
        <div className="w-[360px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <p className="text-sm font-semibold text-slate-900">Notifications</p>
                <button
                    type="button"
                    onClick={onMarkAllRead}
                    className="text-sm font-semibold text-cyan-600 hover:text-cyan-700"
                >
                    Mark all as read
                </button>
            </div>

            {/* List */}
            <div className="max-h-[420px] overflow-auto">
                {ITEMS.map((n, idx) => (
                    <div
                        key={n.id}
                        className={[
                            "flex gap-4 px-5 py-4",
                            idx !== ITEMS.length - 1 ? "border-b border-slate-100" : "",
                        ].join(" ")}
                    >
                        <IconBox type={n.type} />

                        <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                                <p className="truncate text-sm font-semibold text-slate-900">
                                    {n.title}
                                </p>
                                <p className="shrink-0 text-xs text-slate-400">{n.time}</p>
                            </div>

                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                {n.message}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer button */}
            <div className="border-t border-slate-100 p-4">
                <button
                    type="button"
                    onClick={onViewAll}
                    className="w-full rounded-xl bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-white hover:bg-[var(--primary-hover)] transition"                >
                    View All Notifications
                </button>
            </div>
        </div>
    );
}