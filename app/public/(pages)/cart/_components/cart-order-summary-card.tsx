"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Lock } from "lucide-react";
import Card from "@/components/cards/card";
import Button from "@/components/buttons/button";
import type { CartCalculateResponse } from "@/types/public/cart/cart.types";
import { money } from "./cart-page-content";

interface CartOrderSummaryCardProps {
    calculatedData: CartCalculateResponse | null;
    hasInvalidQuantity: boolean;
}

export default function CartOrderSummaryCard({
    calculatedData,
    hasInvalidQuantity,
}: CartOrderSummaryCardProps) {
    const router = useRouter();

    const handleProceedToCheckout = () => {
        const token =
            typeof document !== "undefined"
                ? document.cookie.match(/(?:^|;\s*)access_token=([^;]+)/)?.[1]
                : null;

        const checkoutUrl = "/public/checkout";

        if (!token) {
            if (typeof window !== "undefined") {
                window.sessionStorage.setItem(
                    "publicCoursePostAuthRedirect",
                    JSON.stringify({
                        checkoutRoute: checkoutUrl,
                    }),
                );
            }

            router.push("/public/auth/sign-in");
            return;
        }

        router.push(checkoutUrl);
    };

    return (
        <Card>
            <div className="text-lg font-bold text-black">Order Summary</div>
            <div className="mt-4 border-t border-slate-100" />

            <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between text-light-slate">
                    <span>Subtotal</span>
                    <span className="font-bold text-black">
                        {money(Number(calculatedData?.orderSummary?.subtotal || 0))}
                    </span>
                </div>

                <div className="flex items-center justify-between text-light-slate">
                    <span>Estimated Shipping</span>
                    <span className="text-xs italic text-light-slate">
                        Calculated in next step
                    </span>
                </div>

                <div className="flex items-center justify-between text-light-slate">
                    <span>Estimated Tax</span>
                    <span className="font-bold text-black">
                        {money(Number(calculatedData?.orderSummary?.estimatedTax || 0))}
                    </span>
                </div>
            </div>

            {/* Promo section removed */}

            <div className="mt-6 border-t border-slate-100 pt-5">
                <div className="flex items-end justify-between">
                    <div className="text-sm font-bold text-black">Order Total</div>
                    <div className="text-2xl font-bold text-black">
                        {money(Number(calculatedData?.orderSummary?.orderTotal || 0))}
                    </div>
                </div>

                {hasInvalidQuantity ? (
                    <Button
                        disabled
                        className="mt-5 h-14 w-full cursor-not-allowed bg-gray-300 text-white shadow-sm"
                    >
                        Fix cart before checkout
                    </Button>
                ) : (
                    <Button
                        onClick={handleProceedToCheckout}
                        className="mt-5 h-14 w-full bg-primary text-white shadow-sm"
                    >
                        Proceed to Checkout
                        <ArrowRight className="h-5 w-5" />
                    </Button>
                )}

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-light-slate">
                    <Lock className="h-4 w-4" />
                    Secure Checkout
                </div>

                <div className="mt-3 flex items-center justify-center gap-2">
                    <span className="rounded-md bg-light-slate/10 px-3 py-1 text-[10px] text-light-slate">
                        VISA
                    </span>
                    <span className="rounded-md bg-light-slate/10 px-3 py-1 text-[10px] text-light-slate">
                        MC
                    </span>
                    <span className="rounded-md bg-light-slate/10 px-3 py-1 text-[10px] text-light-slate">
                        AMEX
                    </span>
                    <span className="rounded-md bg-light-slate/10 px-3 py-1 text-[10px] text-light-slate">
                        PAYPAL
                    </span>
                </div>
            </div>
        </Card>
    );
}