"use client";

import React from "react";
import Card from "@/components/cards/card";
import { GraduationCap, Building2, Wrench } from "lucide-react";
import { motion } from "motion/react";
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
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto w-full max-w-[980px] px-4 pb-14 pt-10"
    >
      <div className="text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-sm font-semibold text-slate-600"
        >
          {heading}
        </motion.p>
      </div>

      <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-3">
        {categories.map((c, index) => (
          <motion.button
            key={c.key}
            type="button"
            onClick={() => {
              c.onClick?.();
              onSelect?.(c.key);
            }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{
              duration: 0.5,
              delay: 0.15 + index * 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{ y: -6 }}
            className="text-left"
          >
            <Card
              shape="soft"
              className="border border-light-slate p-6 shadow-sm transition-all duration-300 hover:border-primary/25 hover:bg-primary/5 hover:shadow-md"
            >
              <motion.div
                whileHover={{ scale: 1.08, rotate: 5 }}
                transition={{ duration: 0.2 }}
                className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 transition-colors duration-300 group-hover:bg-primary/10"
              >
                <CategoryIcon kind={c.icon} />
              </motion.div>

              <motion.h3
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: false }}
                transition={{ duration: 0.3, delay: 0.25 + index * 0.1 }}
                className="mt-4 text-center text-sm font-semibold text-slate-900"
              >
                {c.title}
              </motion.h3>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: false }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                className="mt-2 text-center text-xs leading-5 text-slate-500"
              >
                {c.description}
              </motion.p>
            </Card>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

function CategoryIcon({ kind }: { kind: HelpCategory["icon"] }) {
  const cls = "h-5 w-5 text-primary transition-transform duration-200";
  if (kind === "enrollment") return <GraduationCap className={cls} />;
  if (kind === "bookings") return <Building2 className={cls} />;
  return <Wrench className={cls} />;
}
