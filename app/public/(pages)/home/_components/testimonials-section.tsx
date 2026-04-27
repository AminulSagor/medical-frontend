"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import TestimonialCard from "./testimonial-card";
import { getExpertReviews } from "@/service/public/expert-review.service";
import { ExpertReview } from "@/types/public/review/expert-review.types";

const INITIAL_VISIBLE_COUNT = 6;
const LOAD_MORE_COUNT = 3;

export default function TestimonialsSection() {
  const [items, setItems] = useState<ExpertReview[]>([]);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchReviews = async () => {
      try {
        setLoading(true);

        const response = await getExpertReviews(1, 10);
        const reviews = Array.isArray(response?.data) ? response.data : [];

        if (isMounted) {
          setItems(reviews);
        }
      } catch (error) {
        console.error("Failed to load expert reviews", error);

        if (isMounted) {
          setItems([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchReviews();

    return () => {
      isMounted = false;
    };
  }, []);

  const visibleItems = useMemo(() => {
    return items.slice(0, visibleCount);
  }, [items, visibleCount]);

  const hasMore = visibleCount < items.length;

  return (
    <section className="w-full overflow-hidden padding">
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

        <div className="mt-12 min-h-[320px]">
          {loading ? (
            <div className="grid gap-8 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[260px] animate-pulse rounded-3xl border border-light-slate/10 bg-light-slate/5"
                />
              ))}
            </div>
          ) : visibleItems.length === 0 ? (
            <div className="py-12 text-center text-light-slate">
              No expert reviews found yet. Be the first to leave one!
            </div>
          ) : (
            <>
              <motion.div
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: {
                    transition: {
                      staggerChildren: 0.12,
                    },
                  },
                }}
                className="grid items-stretch gap-8 lg:grid-cols-3"
              >
                {visibleItems.map((t, index) => {
                  const reviewer = t.reviewByInfo;

                  return (
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
                          quote: t.reviewMessage || "",
                          author: {
                            name: reviewer?.name || "Anonymous",
                            role: reviewer?.designation || "Medical Expert",
                            avatarSrc: reviewer?.profileImg || "",
                          },
                        }}
                        index={index}
                      />
                    </motion.div>
                  );
                })}
              </motion.div>

              {hasMore && (
                <div className="mt-10 flex justify-center hidden">
                  <motion.button
                    type="button"
                    onClick={() =>
                      setVisibleCount((prev) =>
                        Math.min(prev + LOAD_MORE_COUNT, items.length),
                      )
                    }
                    whileHover={{ y: -2, scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    className="rounded-full bg-primary px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
                  >
                    Load More
                  </motion.button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
