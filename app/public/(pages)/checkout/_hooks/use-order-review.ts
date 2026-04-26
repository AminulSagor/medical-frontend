"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/app/public/context/cart-context";
import { getProductDetails } from "@/service/public/product.service";
import { getOrderSummary } from "@/service/user/order-summary.service";
import {
    createCheckoutSession,
    getCheckoutRedirectUrl,
} from "@/service/user/checkout-session.service";
import type { OrderSummaryResponse } from "@/app/public/types/order-summary.types";
import type { UpdateShippingAddressPayload } from "@/app/public/types/shipping-address.types";
import {
    formatMoney,
    OrderItemData,
    UUID_REGEX,
} from "@/app/public/(pages)/checkout/_utils/order-review.helpers";

export function useOrderReview(shippingAddress: UpdateShippingAddressPayload) {
    const searchParams = useSearchParams();
    const { items } = useCart();

    const [summary, setSummary] = useState<OrderSummaryResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [isStartingCheckout, setIsStartingCheckout] = useState(false);
    const [checkoutError, setCheckoutError] = useState<string | null>(null);
    const [fallbackOrderItems, setFallbackOrderItems] = useState<OrderItemData[]>(
        [],
    );

    const checkoutMode = searchParams.get("mode");
    const buyNowProductId = searchParams.get("productId");
    const buyNowQuantity = Number(searchParams.get("quantity") || "1");

    const checkoutItems = useMemo(() => {
        if (
            checkoutMode === "buy-now" &&
            buyNowProductId &&
            UUID_REGEX.test(buyNowProductId)
        ) {
            return [
                {
                    productId: buyNowProductId,
                    quantity:
                        Number.isFinite(buyNowQuantity) && buyNowQuantity > 0
                            ? buyNowQuantity
                            : 1,
                },
            ];
        }

        return items.filter((item) => UUID_REGEX.test(item.productId));
    }, [buyNowProductId, buyNowQuantity, checkoutMode, items]);

    useEffect(() => {
        if (checkoutItems.length === 0) {
            setFallbackOrderItems([]);
            return;
        }

        const fetchFallbackOrderItems = async () => {
            try {
                const results = await Promise.allSettled(
                    checkoutItems.map(async (item): Promise<OrderItemData> => {
                        const data = await getProductDetails(item.productId);

                        const unitPrice =
                            Number.parseFloat(
                                String(
                                    (data as any).offerPrice || (data as any).actualPrice || "0",
                                ),
                            ) || 0;

                        return {
                            id: item.productId,
                            title: String(
                                (data as any).name || (data as any).title || "Product",
                            ),
                            qty: item.quantity,
                            price: formatMoney(unitPrice * item.quantity),
                            imageSrc:
                                (Array.isArray((data as any).images) &&
                                    typeof (data as any).images[0] === "string"
                                    ? (data as any).images[0]
                                    : null) || "/photos/store_product.png",
                            availableQuantity:
                                typeof (data as any).stockQuantity === "number"
                                    ? (data as any).stockQuantity
                                    : undefined,
                        };
                    }),
                );

                setFallbackOrderItems(
                    results
                        .filter((result) => result.status === "fulfilled")
                        .map((result) => result.value),
                );
            } catch (error) {
                console.error("Failed to fetch fallback checkout products", error);
                setFallbackOrderItems([]);
            }
        };

        fetchFallbackOrderItems();
    }, [checkoutItems]);

    useEffect(() => {
        if (checkoutItems.length === 0) {
            setSummary(null);
            return;
        }

        const fetchOrderSummary = async () => {
            setLoading(true);

            try {
                const data = await getOrderSummary({
                    items: checkoutItems.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                    })),
                });

                setSummary(data);
            } catch (error) {
                console.error("Failed to fetch order summary", error);
                setSummary(null);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderSummary();
    }, [checkoutItems]);

    const orderItems: OrderItemData[] = useMemo(() => {
        const fallbackMap = new Map(
            fallbackOrderItems.map((item) => [item.id, item] as const),
        );

        return checkoutItems.map((checkoutItem) => {
            const summaryItem = summary?.items?.find(
                (item) => item.productId === checkoutItem.productId,
            );
            const fallbackItem = fallbackMap.get(checkoutItem.productId);

            const unitPriceFromSummary = summaryItem
                ? Number.parseFloat(summaryItem.unitPrice || "0")
                : null;

            return {
                id: checkoutItem.productId,
                title: summaryItem?.name || fallbackItem?.title || "Product",
                qty: checkoutItem.quantity,
                price: summaryItem
                    ? formatMoney((unitPriceFromSummary || 0) * checkoutItem.quantity)
                    : fallbackItem?.price || "$0.00",
                imageSrc: summaryItem?.photo || fallbackItem?.imageSrc,
                availableQuantity:
                    typeof summaryItem?.availableQuantity === "number"
                        ? summaryItem.availableQuantity
                        : fallbackItem?.availableQuantity,
            };
        });
    }, [checkoutItems, summary, fallbackOrderItems]);

    const invalidStockItems = useMemo(() => {
        return orderItems.filter((item) => {
            if (typeof item.availableQuantity !== "number") return false;
            return item.qty > item.availableQuantity;
        });
    }, [orderItems]);

    const hasInvalidQuantity = invalidStockItems.length > 0;

    const stockValidationMessage = useMemo(() => {
        if (!hasInvalidQuantity) return null;

        if (invalidStockItems.length === 1) {
            const item = invalidStockItems[0];
            return `${item.title}: only ${item.availableQuantity} available, but ${item.qty} selected.`;
        }

        return "Some items exceed available stock. Please update the quantities before payment.";
    }, [hasInvalidQuantity, invalidStockItems]);

    const subtotal = useMemo(() => {
        return formatMoney(
            orderItems.reduce((sum, item) => {
                const numericValue = Number.parseFloat(item.price.replace("$", "")) || 0;
                return sum + numericValue;
            }, 0),
        );
    }, [orderItems]);

    const shippingNumber = Number(summary?.estimatedShipping ?? 0);
    const shipping = shippingNumber === 0 ? "Free" : formatMoney(shippingNumber);
    const tax = summary?.estimatedTax
        ? formatMoney(summary.estimatedTax)
        : "$0.00";

    const total = useMemo(() => {
        const subtotalNumber = Number.parseFloat(subtotal.replace("$", "")) || 0;
        const taxNumber =
            Number.parseFloat(String(summary?.estimatedTax ?? "0")) || 0;
        const shippingValue = Number(summary?.estimatedShipping ?? 0) || 0;

        return formatMoney(subtotalNumber + taxNumber + shippingValue);
    }, [subtotal, summary]);

    const handlePay = async () => {
        setCheckoutError(null);

        if (!summary?.orderSummaryId) {
            setCheckoutError("Order summary is not ready. Please wait a moment.");
            return;
        }

        if (hasInvalidQuantity) {
            setCheckoutError(
                stockValidationMessage ||
                "Some items exceed available stock. Please update the quantities before payment.",
            );
            return;
        }

        if (
            !shippingAddress.fullName?.trim() ||
            !shippingAddress.addressLine1?.trim() ||
            !shippingAddress.city?.trim() ||
            !shippingAddress.state?.trim() ||
            !shippingAddress.zipCode?.trim()
        ) {
            setCheckoutError("Please complete all required shipping address fields.");
            return;
        }

        try {
            setIsStartingCheckout(true);

            const latestSummary = await getOrderSummary({
                items: checkoutItems.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                })),
            });

            setSummary(latestSummary);

            const origin = window.location.origin;

            const response = await createCheckoutSession({
                domainType: "product",
                orderSummaryId: latestSummary.orderSummaryId,
                successUrl: `${origin}/public/order-success?session_id={CHECKOUT_SESSION_ID}`,
                cancelUrl: `${origin}/public/checkout`,
                shippingAddress: {
                    fullName: shippingAddress.fullName.trim(),
                    addressLine1: shippingAddress.addressLine1.trim(),
                    addressLine2: shippingAddress.addressLine2?.trim() || undefined,
                    city: shippingAddress.city.trim(),
                    state: shippingAddress.state.trim(),
                    zipCode: shippingAddress.zipCode.trim(),
                },
            });

            const redirectUrl = getCheckoutRedirectUrl(response);

            if (!redirectUrl) {
                throw new Error("No checkout url returned from API");
            }

            window.location.href = redirectUrl;
        } catch (error: any) {
            console.error("Failed to start checkout session", error);

            if (error?.response?.status === 401 && typeof window !== "undefined") {
                const redirect = `${window.location.pathname}${window.location.search}`;
                window.location.href = `/public/auth/sign-in?redirect=${encodeURIComponent(
                    redirect,
                )}`;
                return;
            }

            const apiMessage = error?.response?.data?.message;
            setCheckoutError(
                apiMessage ||
                error?.message ||
                "Failed to start checkout. Please try again.",
            );
        } finally {
            setIsStartingCheckout(false);
        }
    };

    return {
        summary,
        loading,
        isStartingCheckout,
        checkoutError,
        orderItems,
        shippingNumber,
        shipping,
        subtotal,
        tax,
        total,
        hasInvalidQuantity,
        stockValidationMessage,
        handlePay,
    };
}