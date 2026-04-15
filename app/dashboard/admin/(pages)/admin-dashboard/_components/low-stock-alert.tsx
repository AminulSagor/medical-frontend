"use client";

import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";

import type { DashboardLowStockAlert } from "@/types/admin/dashboard.types";
import { mapAdminDashboardRoute } from "../_utils/dashboard-route";

export default function LowStockAlert({
  lowStockAlerts,
}: {
  lowStockAlerts: DashboardLowStockAlert[];
}) {
  const router = useRouter();
  const manageRoute = lowStockAlerts[0]?.manageInventoryRoute;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="h-1 w-full bg-rose-500" />

      <div className="p-5">
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-rose-50 text-rose-600 ring-1 ring-rose-100">
            <AlertTriangle size={18} />
          </div>

          <div>
            <p className="text-base font-semibold text-slate-900">
              Low Stock Alert
            </p>
            <p className="text-sm text-slate-500">Items needing restock</p>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {lowStockAlerts.length === 0 ? (
            <div className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-500">
              No low stock alerts.
            </div>
          ) : (
            lowStockAlerts.map((item) => (
              <div
                key={item.productId}
                className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-4 py-3"
              >
                <p className="text-sm font-medium text-slate-700">
                  {item.productName}
                </p>

                <span className="rounded-md bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                  {item.unitsLeft} units left
                </span>
              </div>
            ))
          )}
        </div>

        <button
          type="button"
          onClick={() => {
            if (manageRoute) {
              router.push("/dashboard/admin/products");
            }
          }}
          disabled={!manageRoute}
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)] hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Manage Inventory <span aria-hidden>›</span>
        </button>
      </div>
    </div>
  );
}
