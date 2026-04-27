// AboutCredentials.tsx
"use client";
import CredentialsGrid from "./credentials-grid";
import { motion } from "framer-motion";

export default function AboutCredentials() {
  return (
    <section className="py-20 bg-[rgba(246,247,248,0.55)]">
      <div className="padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="flex items-start justify-between gap-6 flex-wrap"
        >
          <div>
            <motion.h3
              className="font-serif text-[38px] font-bold text-black"
              initial={{ clipPath: "inset(0 50% 0 0)" }}
              whileInView={{ clipPath: "inset(0 0% 0 0)" }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.8, ease: [0.77, 0, 0.18, 1] }}
            >
              Expertise &{" "}
              <span className="italic text-primary">Credentials</span>
            </motion.h3>
          </div>
          <motion.p
            className="max-w-[46ch] text-xs leading-6 text-light-slate/60"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            A snapshot of professional milestones and core competencies.
          </motion.p>
        </motion.div>

        <CredentialsGrid />
      </div>
    </section>
  );
}
