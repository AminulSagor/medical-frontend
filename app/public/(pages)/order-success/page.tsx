"use client";

import Image from "next/image";
import { Check, Truck, CalendarDays, Mail, ShieldCheck } from "lucide-react";
import Card from "@/components/cards/card";
import Button from "@/components/buttons/button";
import { IMAGE } from "@/constant/image-config";
import Link from "next/link";

export default function OrderSuccessPage() {
  const orderId = "ORD-8829";
  const totalPaid = "$211.13";

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 mt-20">
      <Card className="mx-auto w-full max-w-[760px] p-8 shadow-md">
        {/* top check */}
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

        {/* inner details card */}
        <div className="mt-8">
          <Card className="bg-white p-0">
            <div className="p-6">
              {/* header row */}
              <div className="flex items-start justify-between gap-6">
                {/* product thumbs */}
                <div className="flex items-center gap-2">
                  <div className="h-11 w-11 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                    <Image
                      src={IMAGE.hand_gloves}
                      alt="product"
                      width={44}
                      height={44}
                      className="h-11 w-11 object-cover"
                    />
                  </div>
                  <div className="h-11 w-11 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                    <Image
                      src={IMAGE.hand_gloves}
                      alt="product"
                      width={44}
                      height={44}
                      className="h-11 w-11 object-cover"
                    />
                  </div>
                  <div className="h-11 w-11 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                    <Image
                      src={IMAGE.hand_gloves}
                      alt="product"
                      width={44}
                      height={44}
                      className="h-11 w-11 object-cover"
                    />
                  </div>
                </div>

                {/* total paid */}
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

              {/* details grid */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* shipping */}
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-50">
                    <Truck className="h-5 w-5 text-sky-600" />
                  </div>

                  <div>
                    <p className="font-semibold text-slate-900">
                      Shipping Details
                    </p>
                    <div className="mt-2 text-sm text-slate-500">
                      <p>Dr. Sarah Thompson</p>
                      <p>4500 Medical Drive, Suite</p>
                      <p>200</p>
                    </div>
                  </div>
                </div>

                {/* delivery */}
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-50">
                    <CalendarDays className="h-5 w-5 text-sky-600" />
                  </div>

                  <div>
                    <p className="font-semibold text-slate-900">
                      Estimated Delivery
                    </p>
                    <div className="mt-2 text-sm text-slate-500">
                      <p>Monday, Oct 28 -</p>
                      <p>Wednesday, Oct 30</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* email note */}
              <div className="mt-6 rounded-2xl border border-sky-100 bg-sky-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
                    <Mail className="h-4 w-4 text-sky-600" />
                  </div>

                  <p className="text-sm text-slate-600">
                    A confirmation email with tracking details has been sent to{" "}
                    <span className="font-semibold text-slate-900">
                      sarah.t@hospital.com
                    </span>
                    .
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* actions */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            variant="primary"
            size="md"
            shape="pill"
            className="w-full sm:w-auto bg-primary text-white"
          >
            View Order Details
          </Button>
          <Link href={"/public/store"}>
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

        {/* footer */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs tracking-widest text-slate-400">
          <ShieldCheck className="h-4 w-4 text-slate-400" />
          <span>SECURE PURCHASE GUARANTEE</span>
        </div>
      </Card>
    </div>
  );
}
