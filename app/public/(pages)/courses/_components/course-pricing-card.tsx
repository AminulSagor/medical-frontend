"use client";

import React from "react";
import { Check, Users, Info } from "lucide-react";
import Button from "@/components/buttons/button";
import { CourseDetails } from "@/app/public/types/course.details.types";
import Card from "@/components/cards/card";
import { useRouter } from "next/navigation";
import { getToken } from "@/utils/token/cookie_utils";

function money(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default function CoursePricingCard({ data }: { data: CourseDetails }) {
  const router = useRouter();
  const p = data.pricing;

  const isEnrollmentDisabled = !!p.ctaDisabled;

  const handleEnrollment = () => {
    if (isEnrollmentDisabled) return;
    const checkoutRoute = `/public/workshop-checkout?workshopId=${data.id}`;

    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "publicCoursePostAuthRedirect",
        JSON.stringify({
          source: `/public/courses/details/${data.id}`,
          checkoutRoute,
          workshopId: data.id,
        }),
      );
    }

    const token = getToken();

    if (!token) {
      router.push("/public/auth/sign-in");
      return;
    }

    router.push(checkoutRoute);
  };

  return (
    <div className="overflow-hidden border border-light-slate/15 shadow-sm p-0 rounded-3xl">
      <div className="bg-black p-7">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-xs font-extrabold tracking-[0.18em] text-white/70">
              {p.feeLabel}
            </p>
            <p className="mt-2 text-4xl font-extrabold text-white">
              {money(p.price)}
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs font-extrabold text-primary">ALL-INCLUSIVE</p>
            <p className="mt-1 text-xs font-semibold text-white/70">
              {p.perLabel}
            </p>
          </div>
        </div>
      </div>

      <div className="p-7">
        <div className="space-y-4">
          {p.features.map((f) => (
            <div key={f.id} className="flex items-center gap-3">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-primary/10">
                <Check size={16} className="text-primary" />
              </span>
              <p className="text-sm font-semibold text-light-slate">
                {f.label}
              </p>
            </div>
          ))}
        </div>

        <Card
          shape="soft"
          className="mt-6 border border-light-slate/15 bg-light-slate/5"
        >
          <div className="flex items-center gap-2 text-xs font-extrabold tracking-[0.14em] text-light-slate">
            <Users size={16} className="text-light-slate" />
            {p.groupSave.title}
          </div>

          <div className="mt-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-light-slate line-through">
                {money(p.groupSave.oldPrice)}
              </p>
              <p className="mt-1 text-3xl font-extrabold text-black">
                {money(p.groupSave.newPrice)}
              </p>
              <p className="mt-1 text-xs font-extrabold tracking-[0.12em] text-light-slate">
                PER PERSON
              </p>
            </div>

            <span className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-xs font-extrabold text-white">
              {p.groupSave.discountLabel}
            </span>
          </div>

          <p className="mt-3 text-xs font-semibold text-light-slate">
            {p.groupSave.note}
          </p>
        </Card>

        <div className="mt-7">
          <Button
            className={[
              "w-full h-12",
              isEnrollmentDisabled
                ? "!bg-light-slate !text-white hover:!opacity-100 disabled:!opacity-100"
                : "",
            ].join(" ")}
            onClick={handleEnrollment}
            disabled={isEnrollmentDisabled}
          >
            {p.ctaLabel}
          </Button>

          <div className={[
            "mt-4 flex items-center justify-center gap-2 text-sm font-extrabold",
            p.warningTone === "danger" ? "text-red" : "text-light-slate",
          ].join(" ")}>
            <Info size={16} />
            {p.warningLabel}
          </div>

          <p className="mt-4 text-center text-[10px] font-extrabold tracking-[0.18em] text-light-slate">
            {p.footnote}
          </p>
        </div>
      </div>
    </div>
  );
}
