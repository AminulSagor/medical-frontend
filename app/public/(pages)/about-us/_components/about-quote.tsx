import { Heart } from "lucide-react";
import type { AboutQuote } from "@/types/about/about-types";

const Q: AboutQuote = {
  icon: "heart",
  title: "“Every breath counts.”",
  description:
    "In the silence of the OR, my focus narrows to a singular purpose: ensuring the continuity of life. It is a sacred trust I hold with every patient.",
};

export default function AboutQuoteSection() {
  return (
    <section className="relative py-28 overflow-hidden">
      {/* subtle soft background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[380px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-3xl" />
      </div>

      <div className="relative padding">
        <div className="mx-auto max-w-[820px] text-center">
          
          {/* PERFECT CENTER HEART */}
          <div className="flex justify-center">
            <Heart
              size={36}
              strokeWidth={0}
              className="fill-primary text-primary"
            />
          </div>

          {/* TITLE — NOT EXTRABOLD */}
          <h3 className="mt-8 font-serif text-[56px] leading-[1.1] font-semibold text-black">
            {Q.title}
          </h3>

          {/* DESCRIPTION — softer */}
          <p className="mx-auto mt-6 max-w-[70ch] text-[15px] leading-7 font-normal text-light-slate/70">
            {Q.description}
          </p>
        </div>
      </div>
    </section>
  );
}