"use client";

import { UserPlus } from "lucide-react";

export default function UsersHeader({
    title,
    subtitle,
    actionLabel,
    onAction,
}: {
    title: string;
    subtitle: string;
    actionLabel?: string;
    onAction?: () => void;
}) {
    return (
        <div className="flex items-start justify-between gap-4">
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900">{title}</h1>
                <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
            </div>

            {actionLabel && (
                <button
                    onClick={onAction}
                    className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--primary-hover)] transition"
                >
                    <UserPlus size={18} />
                    {actionLabel}
                </button>
            )}
        </div>
    );
}