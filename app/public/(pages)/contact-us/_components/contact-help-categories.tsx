"use client";

import React from "react";
import Card from "@/components/cards/card";
import { GraduationCap, Building2, Wrench } from "lucide-react";
import type { ContactUsInquiryType } from "@/types/public/contact-us/contact-us.type";

export type HelpCategory = {
  key: ContactUsInquiryType;
  title: string;
  description: string;
  icon: "enrollment" | "bookings" | "support";
  onClick?: () => void;
};

type Props = {
  heading?: string;
  categories?: HelpCategory[];
  onSelect?: (type: ContactUsInquiryType) => void;
};

export default function ContactHelpCategories({
  heading = "Or browse our help categories",
  categories = [
    {
      key: "enrollment",
      title: "Enrollment & Programs",
      description:
        "Questions about course prerequisites, schedules, and application deadlines.",
      icon: "enrollment",
    },
    {
      key: "facility_booking",
      title: "Group Bookings",
      description:
        "Reserve simulation labs for hospital teams, workshops, or training events.",
      icon: "bookings",
    },
    {
      key: "technical_support",
      title: "Technical Support",
      description:
        "Issues with simulation software, AV equipment, or online portal access.",
      icon: "support",
    },
  ],
  onSelect,
}: Props) {
  return (
    <div className="mx-auto w-full max-w-[980px] px-4 pb-14 pt-10">
      <div className="text-center">
        <p className="text-sm font-semibold text-slate-600">{heading}</p>
      </div>

      <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-3">
        {categories.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => {
              c.onClick?.();
              onSelect?.(c.key);
            }}
            className="text-left"
          >
            <Card
              shape="soft"
              className="border border-light-slate p-6 shadow-sm transition-all duration-200 hover:border-primary/25 hover:bg-primary/5 hover:shadow-md"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 transition-colors duration-200 hover:bg-primary/10">
                <CategoryIcon kind={c.icon} />
              </div>

              <h3 className="mt-4 text-center text-sm font-semibold text-slate-900">
                {c.title}
              </h3>

              <p className="mt-2 text-center text-xs leading-5 text-slate-500">
                {c.description}
              </p>
            </Card>
          </button>
        ))}
      </div>
    </div>
  );
}

function CategoryIcon({ kind }: { kind: HelpCategory["icon"] }) {
  const cls = "h-5 w-5 text-primary";
  if (kind === "enrollment") return <GraduationCap className={cls} />;
  if (kind === "bookings") return <Building2 className={cls} />;
  return <Wrench className={cls} />;
}