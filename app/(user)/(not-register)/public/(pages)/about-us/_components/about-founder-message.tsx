import Card from "@/components/cards/card";
import { Quote } from "lucide-react";
import type { FounderMessage } from "@/types/about/about-types";

const MSG: FounderMessage = {
  title: "Message from the Founder",
  quote:
    "“Medicine is not merely the application of science, but the profound act of standing with someone in their most vulnerable moments. My journey has taught me that true healing requires both the precision of a surgeon and the empathy of a friend.”",
  body:
    "At the Texas Airway Institute, we believe that resilience is built through understanding. Every patient brings a unique story, and it is our privilege to listen, to care, and to guide them towards recovery with dignity and expertise. This philosophy is the cornerstone of every procedure we perform and every life we touch.",
  signature: "Victor Enoh, MD",
};

export default function AboutFounderMessage() {
  return (
    <section className="py-24">
      <div className="padding">
        <div className="mx-auto max-w-[900px]">
          <div className="relative">
            {/* Quote badge (floating) */}
            <div className="absolute -top-6 left-6 z-10 grid h-12 w-12 place-items-center rounded-[10px] bg-primary text-white shadow-md">
              <Quote size={20} strokeWidth={2.5} />
            </div>

            <Card className="relative rounded-[22px] border border-light-slate/10 bg-white px-12 py-12 shadow-sm">
              {/* Left Accent Line */}
              <div className="absolute left-0 top-0 h-full w-[3px] bg-primary" />

              <h3 className="text-[18px] font-semibold text-black">
                {MSG.title}
              </h3>

              <p className="mt-6 font-serif italic text-[16px] leading-8 text-black/80">
                {MSG.quote}
              </p>

              <p className="mt-6 text-[14px] leading-7 text-light-slate/70">
                {MSG.body}
              </p>

              <div className="mt-8 h-px w-full bg-light-slate/10" />

              <div className="mt-5 text-right text-[14px] font-semibold text-black">
                {MSG.signature}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}