"use client";

import React, { useMemo } from "react";
import TestimonialCard from "./testimonial-card";
import { TESTIMONIALS } from "@/app/(user)/(not-register)/public/data/testimonials.data";

export default function TestimonialsSection() {
  const items = useMemo(() => TESTIMONIALS, []);

  return (
    <section className="w-full padding">
      <div className="py-12">
        {/* header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold text-primary">TESTIMONIALS</p>

          <h2 className="mt-3 text-4xl font-semibold text-black md:text-5xl">
            Trusted by Experts
          </h2>

          <p className="mt-4 text-base leading-relaxed text-light-slate">
            See what leading physicians and emergency specialists say about our
            training methodology.
          </p>
        </div>

        {/* cards */}
        <div className="mt-12 grid gap-8 lg:grid-cols-3 items-stretch">
          {items.map((t) => (
            <TestimonialCard key={t.id} item={t} />
          ))}
        </div>
      </div>

      
    </section>
  );
}
