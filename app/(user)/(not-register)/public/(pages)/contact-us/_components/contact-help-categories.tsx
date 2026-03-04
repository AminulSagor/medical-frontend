"use client";

import React from "react";
import Card from "@/components/cards/card";
import { GraduationCap, Building2, Wrench } from "lucide-react";

export type HelpCategory = {
  key: string;
  title: string;
  description: string;
  icon: "enrollment" | "bookings" | "support";
  onClick?: () => void;
};

type Props = {
  heading?: string;
  categories?: HelpCategory[];
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
      key: "bookings",
      title: "Group Bookings",
      description:
        "Reserve simulation labs for hospital teams, workshops, or training events.",
      icon: "bookings",
    },
    {
      key: "support",
      title: "Technical Support",
      description:
        "Issues with simulation software, AV equipment, or online portal access.",
      icon: "support",
    },
  ],
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
            onClick={c.onClick}
            className="text-left"
          >
            <Card shape="soft" className="border border-light-slate p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-50">
                <CategoryIcon kind={c.icon} />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-slate-900 text-center">
                {c.title}
              </h3>

              <p className="mt-2 text-xs leading-5 text-slate-500 text-center">
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