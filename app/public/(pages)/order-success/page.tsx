"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Check, Truck, CalendarDays, Mail, ShieldCheck } from "lucide-react";
import Card from "@/components/cards/card";
import Button from "@/components/buttons/button";
import { IMAGE } from "@/constant/image-config";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/app/public/context/cart-context";
import { getPaymentSessionStatus } from "@/service/user/payment-session-status.service";
import { getUserOrderDetails } from "@/service/user/order-details.service";
import type { UserOrderDetailsData } from "@/types/user/order/order-details.types";

function money(value: string | number | null | undefined) {
  const parsed =
    typeof value === "number" ? value : Number.parseFloat(value ?? "0");

  if (Number.isNaN(parsed)) return "$0.00";

  return `$${parsed.toFixed(2)}`;
}

function OrderSuccessPageContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const { clearCart } = useCart();

  const [orderDetails, setOrderDetails] = useState<UserOrderDetailsData | null>(
    null,
  );
  const [isResolvingOrder, setIsResolvingOrder] =
    useState<boolean>(!!sessionId);

  const hasClearedCartRef = useRef(false);

  useEffect(() => {
    if (!sessionId) return;

    let cancelled = false;

    const wait = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    const resolveOrder = async () => {
      try {
        setIsResolvingOrder(true);

        for (let attempt = 0; attempt < 12; attempt += 1) {
          const sessionStatus = await getPaymentSessionStatus(sessionId);

          if (sessionStatus.finalizedRefId) {
            const details = await getUserOrderDetails(
              sessionStatus.finalizedRefId,
            );

            if (!cancelled) {
              setOrderDetails(details);
              setIsResolvingOrder(false);
            }
            return;
          }

          await wait(1500);
        }

        if (!cancelled) {
          setIsResolvingOrder(false);
        }
      } catch (error) {
        console.error("Failed to load order success data", error);

        if (!cancelled) {
          setIsResolvingOrder(false);
        }
      }
    };

    resolveOrder();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  useEffect(() => {
    if (orderDetails?.id && !hasClearedCartRef.current) {
      clearCart();
      hasClearedCartRef.current = true;
    }
  }, [orderDetails?.id, clearCart]);

  const previewItems = useMemo(() => {
    return orderDetails?.items?.slice(0, 3) ?? [];
  }, [orderDetails]);

  const orderId = orderDetails?.orderNumber || "—";
  const totalPaid = money(orderDetails?.payment?.grandTotal);
  const isLoadingOrder = !!sessionId && isResolvingOrder;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 mt-20">
      <Card className="mx-auto w-full max-w-[760px] p-8 shadow-md">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
            <Check className="h-7 w-7 text-emerald-600" />
          </div>

          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-900">
            Thank you for your order!
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Your order{" "}
            <span className="font-semibold text-slate-700">#{orderId}</span> has
            been placed successfully.
          </p>
        </div>

        <div className="mt-8">
          <Card className="bg-white p-0">
            <div className="p-6">
              <div className="flex items-start justify-between gap-6">
                <div className="flex items-center gap-2">
                  {previewItems.length > 0 ? (
                    previewItems.map((item) => (
                      <div
                        key={`${item.id ?? item.name}-${item.sku}`}
                        className="h-11 w-11 overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
                      >
                        <Image
                          src={item.imageUrl || IMAGE.hand_gloves}
                          alt={item.name}
                          width={44}
                          height={44}
                          className="h-11 w-11 object-cover"
                        />
                      </div>
                    ))
                  ) : (
                    <div className="h-11 w-11 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                      <Image
                        src={IMAGE.hand_gloves}
                        alt="product"
                        width={44}
                        height={44}
                        className="h-11 w-11 object-cover"
                      />
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <p className="text-xs font-semibold tracking-widest text-slate-400">
                    TOTAL PAID
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">
                    {totalPaid}
                  </p>
                </div>
              </div>

              <div className="my-5 h-px w-full bg-slate-200" />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-50">
                    <Truck className="h-5 w-5 text-sky-600" />
                  </div>

                  <div>
                    <p className="font-semibold text-slate-900">
                      Shipping Details
                    </p>
                    <div className="mt-2 text-sm text-slate-500">
                      <p>{orderDetails?.shipping?.fullName || "—"}</p>
                      <p>{orderDetails?.shipping?.addressLine1 || "—"}</p>
                      <p>
                        {orderDetails?.shipping?.addressLine2 ||
                          orderDetails?.shipping?.cityStateZip ||
                          "—"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-50">
                    <CalendarDays className="h-5 w-5 text-sky-600" />
                  </div>

                  <div>
                    <p className="font-semibold text-slate-900">
                      Estimated Delivery
                    </p>
                    <div className="mt-2 text-sm text-slate-500">
                      <p>
                        {isLoadingOrder
                          ? "Confirming payment..."
                          : orderDetails?.shipmentStatus?.statusLabel || "—"}
                      </p>
                      <p>
                        {isLoadingOrder
                          ? "Please wait a moment"
                          : orderDetails?.shipmentStatus?.estimatedDelivery ||
                            "—"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-sky-100 bg-sky-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
                    <Mail className="h-4 w-4 text-sky-600" />
                  </div>

                  <p className="text-sm text-slate-600">
                    A confirmation email with tracking details has been sent to{" "}
                    <span className="font-semibold text-slate-900">
                      your registered email
                    </span>
                    .
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={
              orderDetails
                ? `/dashboard/user/order-details?id=${orderDetails.id}`
                : "#"
            }
          >
            <Button
              variant="primary"
              size="md"
              shape="pill"
              className="w-full sm:w-auto bg-primary text-white"
              disabled={!orderDetails}
            >
              View Order Details
            </Button>
          </Link>

          <Link href="/public/store">
            <Button
              variant="secondary"
              size="md"
              shape="pill"
              className="w-full sm:w-auto"
            >
              Continue Shopping
            </Button>
          </Link>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs tracking-widest text-slate-400">
          <ShieldCheck className="h-4 w-4 text-slate-400" />
          <span>SECURE PURCHASE GUARANTEE</span>
        </div>
      </Card>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={null}>
      <OrderSuccessPageContent />
    </Suspense>
  );
}
