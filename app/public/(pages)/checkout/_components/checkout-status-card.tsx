"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { CheckCircle2, CircleAlert } from "lucide-react";
import { useCart } from "@/app/public/context/cart-context";
import { getCartList } from "@/service/public/cart-server.service";
import { getToken } from "@/utils/token/cookie_utils";

type ActionButton = {
    label: string;
    href: string;
    variant?: "primary" | "secondary";
};

type CheckoutStatusCardProps = {
    variant: "success" | "cancel";
    title: string;
    description: string;
    sessionId?: string | null;
    primaryAction: ActionButton;
    secondaryAction: ActionButton;
};

function ActionLink({ label, href, variant = "secondary" }: ActionButton) {
    const isPrimary = variant === "primary";

    return (
        <Link
            href={href}
            className={[
                "inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-semibold transition",
                isPrimary
                    ? "bg-primary text-white hover:opacity-90"
                    : "border border-light-slate/20 bg-white text-black hover:bg-light-slate/5",
            ].join(" ")}
        >
            {label}
        </Link>
    );
}

export default function CheckoutStatusCard({
    variant,
    title,
    description,
    sessionId,
    primaryAction,
    secondaryAction,
}: CheckoutStatusCardProps) {
    const isSuccess = variant === "success";
    const hasSyncedCartRef = useRef(false);
    const { syncItems, clearCart } = useCart();

    useEffect(() => {
        if (!isSuccess || hasSyncedCartRef.current) return;

        hasSyncedCartRef.current = true;

        const syncCartAfterSuccess = async () => {
            const token = getToken();

            if (!token) {
                clearCart();
                return;
            }

            try {
                const data = await getCartList();

                syncItems(
                    data.items.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                    })),
                );
            } catch (error) {
                console.error("Failed to refresh cart after checkout", error);
            }
        };

        syncCartAfterSuccess();
    }, [isSuccess, syncItems, clearCart]);

    return (
        <section className="padding py-10 md:py-14">
            <div className="mx-auto flex min-h-[calc(100vh-220px)] max-w-3xl items-center justify-center">
                <div className="w-full rounded-3xl border border-light-slate/10 bg-white p-6 shadow-sm md:p-10">
                    <div className="flex flex-col items-center text-center">
                        <div
                            className={[
                                "mb-5 grid h-20 w-20 place-items-center rounded-full",
                                isSuccess ? "bg-primary/10" : "bg-amber-50",
                            ].join(" ")}
                        >
                            {isSuccess ? (
                                <CheckCircle2 className="text-primary" size={42} />
                            ) : (
                                <CircleAlert className="text-amber-500" size={42} />
                            )}
                        </div>

                        <h1 className="text-2xl font-extrabold text-black md:text-3xl">
                            {title}
                        </h1>

                        <p className="mt-3 max-w-xl text-sm leading-6 text-light-slate md:text-base">
                            {description}
                        </p>

                        {isSuccess ? (
                            <div className="mt-6 w-full max-w-lg rounded-2xl border border-light-slate/10 bg-slate-50 px-4 py-4 text-left">
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-light-slate/70">
                                    Session ID
                                </p>
                                <p className="mt-2 break-all text-sm font-semibold text-black">
                                    {sessionId || "Unavailable"}
                                </p>
                            </div>
                        ) : null}

                        <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
                            <ActionLink {...primaryAction} variant="primary" />
                            <ActionLink {...secondaryAction} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}