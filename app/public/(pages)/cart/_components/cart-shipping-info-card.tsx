"use client";

import { Truck } from "lucide-react";
import Card from "@/components/cards/card";

export default function CartShippingInfoCard() {
    return (
        <Card className="border-primary/20 bg-primary/5">
            <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
                    <Truck className="h-5 w-5 text-primary" />
                </div>

                <div className="min-w-0">
                    <div className="text-sm font-bold text-black">
                        Free Shipping on orders over $500
                    </div>
                    <div className="mt-1 text-xs text-light-slate">
                        Add <span className="text-primary">$288.87</span> more to your cart
                        to qualify.
                    </div>
                </div>
            </div>
        </Card>
    );
}