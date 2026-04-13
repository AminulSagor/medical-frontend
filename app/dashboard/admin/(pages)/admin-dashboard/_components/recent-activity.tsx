"use client";

import { useRouter } from "next/navigation";
import {
    CheckCircle2,
    ShoppingCart,
    UserPlus,
    Wrench,
} from "lucide-react";

import type { DashboardRecentActivity } from "@/types/admin/dashboard.types";
import { mapAdminDashboardRoute } from "../_utils/dashboard-route";

function resolveIcon(icon: string) {
    if (icon === "shopping-cart") return ShoppingCart;
    if (icon === "settings") return Wrench;
    if (icon === "user-plus") return UserPlus;
    return CheckCircle2;
}

function resolveIconTone(icon: string) {
    if (icon === "shopping-cart") {
        return "bg-blue-50 text-blue-600 ring-blue-100";
    }

    if (icon === "settings") {
        return "bg-slate-100 text-slate-600 ring-slate-200";
    }

    if (icon === "user-plus") {
        return "bg-amber-50 text-amber-600 ring-amber-100";
    }

    return "bg-violet-50 text-violet-600 ring-violet-100";
}

export default function RecentActivity({
    recentActivities,
}: {
    recentActivities: DashboardRecentActivity[];
}) {
    const router = useRouter();

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">Recent Activity</p>

            <div className="mt-3 space-y-3">
                {recentActivities.length === 0 ? (
                    <div className="text-xs text-slate-500">No recent activity found.</div>
                ) : (
                    recentActivities.map((activity) => {
                        const Icon = resolveIcon(activity.icon);
                        const tone = resolveIconTone(activity.icon);

                        return (
                            <button
                                key={activity.id}
                                type="button"
                                onClick={() =>
                                    router.push(mapAdminDashboardRoute(activity.actionRoute))
                                }
                                className="flex w-full items-start gap-3 text-left"
                            >
                                <div
                                    className={`grid h-8 w-8 place-items-center rounded-md ring-1 ${tone}`}
                                >
                                    <Icon size={16} />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-xs font-semibold text-slate-900">
                                        {activity.title}
                                    </p>
                                    <p className="mt-1 truncate text-xs text-slate-500">
                                        {activity.description}
                                    </p>
                                </div>
                            </button>
                        );
                    })
                )}
            </div>
        </div>
    );
}