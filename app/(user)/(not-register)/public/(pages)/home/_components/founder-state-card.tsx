"use client";

import { motion } from "motion/react";
import { FounderStat } from "@/app/(user)/(not-register)/public/types/founder.types";
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
        className="h-full border border-light-slate/15 p-6 shadow-sm"
      >
        <div className="flex flex-col gap-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <Icon size={20} className="text-primary" />
          </motion.div>

          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="text-2xl font-extrabold text-black"
            >
              {stat.value}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }}
              className="text-sm font-medium text-light-slate"
            >
              {stat.label}
            </motion.p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}