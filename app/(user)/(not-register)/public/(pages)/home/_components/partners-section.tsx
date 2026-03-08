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
    <section className="w-full border-b border-light-slate/5 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
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
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{
                duration: 0.45,
                delay: index * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{
                y: -3,
                scale: 1.02,
                transition: { duration: 0.18, ease: "easeOut" },
              }}
              className="flex items-center gap-2 text-light-slate/70"
              aria-label={name}
              title={name}
            >
              <span className="grid h-7 w-7 place-items-center rounded-md border border-light-slate/20 bg-white">
                <Icon size={16} className="text-light-slate/70" />
              </span>
              <span className="text-lg font-bold">{name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
