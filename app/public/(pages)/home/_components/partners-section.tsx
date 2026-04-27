"use client";

import type { LucideIcon } from "lucide-react";
import { Cross, Heart, Asterisk, Globe, Pill } from "lucide-react";
import { motion } from "motion/react";

export type PartnerItem = {
  id: string;
  name: string;
  Icon: LucideIcon;
};

export const PARTNERS: PartnerItem[] = [
  { id: "medcore", name: "MEDCORE", Icon: Cross },
  { id: "cardiolife", name: "CardioLife", Icon: Heart },
  { id: "er-united", name: "ER United", Icon: Asterisk },
  { id: "globalhealth", name: "GlobalHealth", Icon: Globe },
  { id: "pharmasim", name: "PharmaSim", Icon: Pill },
];

export default function PartnersSection() {
  return (
    <section className="relative w-full overflow-hidden border-b border-light-slate/5 bg-white">
      {/* Animated gradient background that moves on scroll */}
      <motion.div
        initial={{ x: "-100%" }}
        whileInView={{ x: "0%" }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute inset-0 bg-gradient-to-r from-primary/3 via-transparent to-primary/3"
      />

      <div className="relative mx-auto max-w-7xl px-6 py-10">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.6 }}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="text-center text-xs font-semibold tracking-[0.22em] text-light-slate"
        >
          TRUSTED BY MEDICAL TEAMS AT
        </motion.p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
          {PARTNERS.map(({ id, name, Icon }, index) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, rotateY: 90, scale: 0.8 }}
              whileInView={{ opacity: 1, rotateY: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.4 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.34, 1.2, 0.64, 1],
                type: "spring",
                stiffness: 120,
                damping: 12,
              }}
              whileHover={{
                y: -5,
                scale: 1.05,
                rotateY: 8,
                rotateX: 4,
                transition: { duration: 0.2, ease: "easeOut" },
              }}
              className="group relative flex cursor-default items-center gap-2"
              style={{ transformStyle: "preserve-3d" }}
              aria-label={name}
              title={name}
            >
              {/* Glow effect on hover */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileHover={{ opacity: 1, scale: 1.5 }}
                transition={{ duration: 0.3 }}
                className="absolute -inset-2 rounded-full bg-primary/5 blur-md"
              />

              <motion.span
                whileHover={{ rotate: [0, -10, 10, -5, 0] }}
                transition={{ duration: 0.4 }}
                className="relative grid h-7 w-7 place-items-center rounded-md border border-light-slate/20 bg-white shadow-sm"
              >
                <Icon
                  size={16}
                  className="text-light-slate/70 transition-colors duration-200 group-hover:text-primary"
                />
              </motion.span>

              <motion.span
                initial={{ letterSpacing: "0em" }}
                whileHover={{ letterSpacing: "0.05em" }}
                transition={{ duration: 0.2 }}
                className="relative text-lg font-bold text-light-slate/70 transition-colors duration-200 group-hover:text-primary"
              >
                {name}
              </motion.span>

              {/* Animated underline on hover */}
              <motion.span
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.25 }}
                className="absolute -bottom-1 left-0 h-0.5 w-full origin-left bg-primary/40"
                style={{ transformOrigin: "left" }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
