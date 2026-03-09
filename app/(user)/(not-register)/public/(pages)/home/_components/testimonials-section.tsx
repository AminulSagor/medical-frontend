"use client";

import React, { useMemo } from "react";
import { motion } from "motion/react";
import TestimonialCard from "./testimonial-card";
import { TESTIMONIALS } from "@/app/(user)/(not-register)/public/data/testimonials.data";

export default function TestimonialsSection() {
  const items = useMemo(() => TESTIMONIALS, []);

  return (
    <section className="w-full padding overflow-hidden">
      <div className="py-12">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.12,
              },
            },
          }}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
              show: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: { duration: 0.7, ease: "easeOut" },
              },
            }}
            className="text-sm font-semibold text-primary"
          >
            TESTIMONIALS
          </motion.p>

          <motion.h2
            variants={{
              hidden: { opacity: 0, y: 28, filter: "blur(10px)" },
              show: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: { duration: 0.8, ease: "easeOut" },
              },
            }}
            className="mt-3 text-4xl font-semibold text-black md:text-5xl"
          >
            Trusted by Experts
          </motion.h2>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
              show: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: { duration: 0.75, ease: "easeOut" },
              },
            }}
            className="mt-4 text-base leading-relaxed text-light-slate"
          >
            See what leading physicians and emergency specialists say about our
            training methodology.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.14,
              },
            },
          }}
          className="mt-12 grid items-stretch gap-8 lg:grid-cols-3"
        >
          {items.map((t, index) => (
            <motion.div
              key={t.id}
              variants={{
                hidden: {
                  opacity: 0,
                  y: 50,
                  scale: 0.96,
                  filter: "blur(10px)",
                },
                show: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  filter: "blur(0px)",
                  transition: {
                    duration: 0.8,
                    ease: [0.22, 1, 0.36, 1],
                    delay: index * 0.03,
                  },
                },
              }}
              className="h-full"
            >
              <TestimonialCard item={t} index={index} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
