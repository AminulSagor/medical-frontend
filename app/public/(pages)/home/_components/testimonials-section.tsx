"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import TestimonialCard from "./testimonial-card";
import { getExpertReviews } from "@/service/public/expert-review.service";
import { ExpertReview } from "@/types/public/review/expert-review.types";

export default function TestimonialsSection() {
  const [items, setItems] = useState<ExpertReview[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await getExpertReviews(1, 10);
        if (response.data) setItems(response.data);
      } catch (error) {
        console.error("Failed to load expert reviews", error);
      }
    };
    fetchReviews();
  }, []);

  // if (!items || items.length === 0) return null;

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
          {items.length === 0 ? (
            <div className="col-span-full py-12 text-center text-light-slate">
              No expert reviews found yet. Be the first to leave one!
            </div>
          ) : (
            items.map((t, index) => (
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
                <TestimonialCard 
                  item={{
                    id: t.id,
                    rating: t.rating as 1 | 2 | 3 | 4 | 5,
                    quote: t.reviewMessage,
                    author: {
                      name: t.reviewByInfo.name,
                      role: t.reviewByInfo.designation,
                      avatarSrc: t.reviewByInfo.profileImg
                    }
                  }} 
                  index={index} 
                />
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </section>
  );
}
