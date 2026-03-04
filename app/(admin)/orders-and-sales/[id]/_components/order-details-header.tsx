"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function OrderDetailsHeader({
    orderId,
    placedAt,
    right,
}: {
    orderId: string;
    placedAt: React.ReactNode;
    right?: React.ReactNode;
}) {
    const router = useRouter();
    const cleanId = (orderId ?? "").trim().replace(/^#/, "");

    return (
        // ✅ MUST be full width so the right block can reach the far right
        <div className="w-full space-y-2">
            {/* Row 1: Back + breadcrumb */}
            <div className="flex w-full items-center gap-3">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white hover:bg-slate-50"
                >
                    <ArrowLeft size={18} className="text-[var(--primary)]" />
                </button>

                <div className="text-sm font-semibold text-slate-400">
                    Orders <span className="mx-2">/</span>
                    <span className="text-slate-900">{cleanId}</span>
                </div>
            </div>

            {/* Row 2: Title + pills at FAR RIGHT */}
            <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center">
                <h1 className="text-3xl font-extrabold text-slate-900">
                    ORDER #{cleanId}
                </h1>

                {right ? (
                    // ✅ ml-auto pushes this to the far right (when row is horizontal)
                    <div className="shrink-0 sm:ml-auto">
                        <div className="flex items-center gap-2">{right}</div>
                    </div>
                ) : null}
            </div>

            {/* Row 3: placed at */}
            <p className="text-sm font-semibold text-slate-500">{placedAt}</p>
        </div>
    );
}