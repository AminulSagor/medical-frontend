// AboutCredentials.tsx
"use client";
import CredentialsGrid from "./credentials-grid";
import { motion } from "framer-motion";

export default function AboutCredentials() {
  return (
    <section className="bg-[rgba(246,247,248,0.55)] py-20">
      <div className="padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.35 }}
          className="flex flex-wrap items-start justify-between gap-6"
        >
          <div>
            <motion.h3
              className="font-serif text-[38px] font-bold text-black"
              initial={{ clipPath: "inset(0 50% 0 0)" }}
              whileInView={{ clipPath: "inset(0 0% 0 0)" }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.4, ease: [0.77, 0, 0.18, 1] }}
            >
              Expertise &{" "}
              <span className="italic text-primary">Credentials</span>
            </motion.h3>
          </div>
          <motion.p
            className="max-w-[46ch] text-xs leading-6 text-light-slate/60"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.3, delay: 0.08 }}
          >
            A snapshot of professional milestones and core competencies.
          </motion.p>
        </motion.div>

        <CredentialsGrid />
      </div>
    </section>
  );
}
