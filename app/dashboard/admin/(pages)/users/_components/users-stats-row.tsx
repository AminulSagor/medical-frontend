"use client";

import {
    Users,
    GraduationCap,
    TrendingUp,
    Percent,
    Star,
    BookOpen,
} from "lucide-react";


export type CardIcon =
    | "users"
    | "grad"
    | "trend"
    | "percent"
    | "star"
    | "book";

export type StatCard = {
    title: string;
    value: string;
    subtitle: string;
    badge?: string;     // ✅ make optional
    icon: CardIcon;     // ✅ accept your string keys
};

function IconChip({ icon }: { icon: CardIcon }) {
    const Icon =
        icon === "users"
            ? Users
            : icon === "grad"
                ? GraduationCap
                : icon === "trend"
                    ? TrendingUp
                    : icon === "percent"
                        ? Percent
                        : icon === "star"
                            ? Star
                            : BookOpen;

    return (
        <div
            className="grid h-12 w-12 place-items-center rounded-full
               bg-[var(--primary-50)] ring-1 ring-[var(--primary)]/20
               text-[var(--primary)]"
        >
            <Icon size={18} />
        </div>
    );
}

export default function UsersStatsRow({ cards }: { cards: StatCard[] }) {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {cards.map((c, idx) => (
                <div
                    key={idx}
                    className="rounded-2xl bg-white p-5 ring-1 ring-slate-200 shadow-sm"
                >
                    <div className="flex items-start justify-between gap-3">
                        <IconChip icon={c.icon} />
                        <div className="flex-1">
                            <div className="text-[11px] font-semibold tracking-wide text-slate-500">
                                {c.title}
                            </div>

                            <div className="mt-1 flex items-center gap-2">
                                <div className="text-2xl font-extrabold text-slate-900">
                                    {c.value}
                                </div>

                                {c.badge ? (
                                    <span
                                        className="inline-flex items-center gap-1 rounded-full
               bg-[var(--primary-50)] px-2.5 py-1
               text-[11px] font-semibold text-[var(--primary)]
               ring-1 ring-[var(--primary)]/20"
                                    >
                                        <TrendingUp size={12} />
                                        {c.badge}
                                    </span>
                                ) : null}
                            </div>

                            <div className="mt-1 text-xs text-slate-500">{c.subtitle}</div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}