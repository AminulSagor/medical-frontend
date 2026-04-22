"use client";

import { motion } from "motion/react";
import { FounderStat } from "@/app/public/types/founder.types";
import Card from "@/components/cards/card";

export default function FounderStatCard({ stat }: { stat: FounderStat }) {
  const Icon = stat.Icon;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="h-full"
    >
      <Card
        shape="soft"
        className="h-full rounded-[28px] border border-light-slate/10 px-7 py-8 shadow-sm"
      >
        <div className="flex h-full flex-col items-start justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotate: -6 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: false, amount: 0.4 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="text-primary"
          >
            <Icon size={28} strokeWidth={2.1} />
          </motion.div>

          <div className="space-y-2">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.4 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="text-[44px] font-bold leading-none text-black"
            >
              {stat.value}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.4 }}
              transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }}
              className="text-[16px] font-medium leading-6 text-light-slate"
            >
              {stat.label}
            </motion.p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}