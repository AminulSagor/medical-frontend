"use client";
import Card from "@/components/cards/card";
import { Quote } from "lucide-react";
import { motion } from "framer-motion";
import type { FounderMessage } from "@/types/public/about/about-types";

const MSG: FounderMessage = {
  title: "Message from the Founder",
  quote:
    "“Medicine is not merely the application of science, but the profound act of standing with someone in their most vulnerable moments. My journey has taught me that true healing requires both the precision of a surgeon and the empathy of a friend.”",
  body: "At the Texas Airway Institute, we believe that resilience is built through understanding. Every patient brings a unique story, and it is our privilege to listen, to care, and to guide them towards recovery with dignity and expertise. This philosophy is the cornerstone of every procedure we perform and every life we touch.",
  signature: "Victor Enoh, MD",
};

export default function AboutFounderMessage() {
  return (
    <section className="py-24">
      <div className="padding">
        <motion.div
          className="mx-auto max-w-[900px]"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative">
            {/* Quote badge with premium animation */}
            <motion.div
              className="absolute -top-6 left-6 z-10 grid h-12 w-12 place-items-center rounded-[10px] bg-primary text-white shadow-md"
              initial={{ scale: 0, rotate: -90 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.2,
              }}
            >
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Quote size={20} strokeWidth={2.5} />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            >
              <Card className="relative rounded-[22px] border border-light-slate/10 bg-white px-12 py-12 shadow-sm overflow-hidden">
                {/* Left Accent Line - Fixed alignment */}
                <motion.div
                  initial={{ height: 0 }}
                  whileInView={{ height: "100%" }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.3,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="absolute left-0 top-0 w-[3px] bg-gradient-to-b from-primary via-primary to-primary/30"
                />

                {/* Subtle background gradient on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/2 to-primary/0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                  initial={false}
                  whileHover={{ opacity: 1 }}
                />

                <motion.h3
                  className="text-[18px] font-semibold text-black"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: 0.25 }}
                >
                  {MSG.title}
                </motion.h3>

                <motion.p
                  className="mt-6 font-serif italic text-[16px] leading-8 text-black/80"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: 0.35 }}
                >
                  {MSG.quote}
                </motion.p>

                <motion.p
                  className="mt-6 text-[14px] leading-7 text-light-slate/70"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: 0.45 }}
                >
                  {MSG.body}
                </motion.p>

                <motion.div
                  className="mt-8 h-px w-full bg-light-slate/10"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: 0.55 }}
                />

                <motion.div
                  className="mt-5 text-right text-[14px] font-semibold text-black"
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: 0.65 }}
                >
                  {MSG.signature}
                </motion.div>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
