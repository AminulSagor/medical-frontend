"use client";

import { motion } from "motion/react";
import { FounderStat } from "@/app/public/types/founder.types";
import Card from "@/components/cards/card";

export default function FounderStatCard({ stat }: { stat: FounderStat }) {
  const Icon = stat.Icon;

  return (
    <motion.div
      whileHover={{
        y: -6,
        rotateX: 6,
        rotateY: 4,
      }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="h-full [perspective:1000px]"
      style={{ transformStyle: "preserve-3d" }}
    >
      <Card
        shape="soft"
        className="relative h-full overflow-hidden rounded-[28px] border border-light-slate/10 px-6 py-6 shadow-sm transition-all duration-300 hover:shadow-md"
      >
        {/* Animated background shimmer */}
        <motion.div
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-primary/5 to-transparent"
          animate={{
            x: ["0%", "200%"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 2,
            ease: "easeInOut",
          }}
        />

        <div className="relative flex h-full flex-col items-start justify-between gap-5">
          {/* Icon with bounce animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: false, amount: 0.4 }}
            transition={{
              duration: 0.5,
              ease: [0.34, 1.2, 0.64, 1],
              type: "spring",
              stiffness: 200,
            }}
            whileHover={{
              rotate: [0, -8, 8, -4, 0],
              scale: 1.1,
              transition: { duration: 0.4 },
            }}
            className="text-primary"
          >
            <Icon size={26} strokeWidth={1.8} />
          </motion.div>

          <div className="space-y-1.5">
            {/* Value - medium weight, black */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.4 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="text-[32px] font-medium leading-tight tracking-tight text-black md:text-[36px]"
            >
              {stat.value}
            </motion.p>

            {/* Label - normal weight, black */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.4 }}
              transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }}
              className="text-[13px] font-normal uppercase leading-relaxed tracking-wider text-black/70"
            >
              {stat.label}
            </motion.p>
          </div>
        </div>

        {/* Animated bottom border */}
        <motion.div
          className="absolute bottom-0 left-0 h-[2px] bg-primary/40"
          initial={{ width: "0%" }}
          whileInView={{ width: "100%" }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        />
      </Card>
    </motion.div>
  );
}
