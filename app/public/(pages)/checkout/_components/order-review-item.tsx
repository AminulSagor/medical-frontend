"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { IMAGE } from "@/constant/image-config";
import type { OrderItemData } from "@/app/public/(pages)/checkout/_utils/order-review.helpers";

export default function OrderReviewItem({
    id,
    title,
    qty,
    price,
    imageSrc,
    availableQuantity,
}: OrderItemData) {
    const router = useRouter();
    const hasAvailabilityInfo =
        typeof availableQuantity === "number" && !Number.isNaN(availableQuantity);
    const exceedsStock = hasAvailabilityInfo && qty > (availableQuantity ?? 0);

    return (
        <div
            className="flex min-w-0 cursor-pointer items-start gap-3"
            onClick={() => router.push(`/public/store/product-details/${id}`)}
        >
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-light-slate">
                <Image
                    src={imageSrc || IMAGE.hand_gloves}
                    alt={title}
                    width={48}
                    height={48}
                    className="h-full w-full object-cover"
                />
            </div>

            <div className="min-w-0 flex-1">
                <p className="break-words text-sm font-semibold text-slate-900">
                    {title}
                </p>
                <p className="text-xs text-slate-500">Qty: {qty}</p>

                {hasAvailabilityInfo && exceedsStock ? (
                    <p className="break-words text-xs text-red-500">
                        Only {availableQuantity} available, but {qty} selected
                    </p>
                ) : null}

                <p className="text-sm font-semibold text-slate-900">{price}</p>
            </div>
        </div>
    );
}