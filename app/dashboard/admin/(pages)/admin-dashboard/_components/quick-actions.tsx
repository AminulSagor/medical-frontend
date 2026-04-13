"use client";

import { Plus, Mail, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";

import type { DashboardQuickAction } from "@/types/admin/dashboard.types";
import { mapAdminDashboardRoute } from "../_utils/dashboard-route";

function resolveIcon(icon: string) {
    if (icon === "plus-square") return Plus;
    if (icon === "mail") return Mail;
    return BookOpen;
}

function ActionBtn({
    icon: Icon,
    label,
    variant = "default",
    disabled = false,
    onClick,
}: {
    icon: React.ElementType;
    label: string;
    variant?: "primary" | "default";
    disabled?: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={[
                "flex w-full items-center justify-center gap-2 rounded-md px-3 py-3 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
                variant === "primary"
                    ? "bg-sky-50 text-sky-600 ring-1 ring-sky-200 hover:bg-sky-100"
                    : "bg-slate-50 text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100",
            ].join(" ")}
        >
            <Icon size={16} />
            {label}
        </button>
    );
}

export default function QuickActions({
    quickActions,
}: {
    quickActions: DashboardQuickAction[];
}) {
    const router = useRouter();

    return (
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">Quick Actions</p>

            <div className="mt-3 space-y-2">
                {quickActions.length === 0 ? (
                    <div className="text-xs text-slate-500">No quick actions available.</div>
                ) : (
                    quickActions.map((action, index) => {
                        const Icon = resolveIcon(action.icon);

                        return (
                            <ActionBtn
                                key={action.key}
                                icon={Icon}
                                label={action.label}
                                variant={index === 0 ? "primary" : "default"}
                                disabled={!action.enabled}
                                onClick={() =>
                                    router.push(mapAdminDashboardRoute(action.route))
                                }
                            />
                        );
                    })
                )}
            </div>
        </div>
    );
}