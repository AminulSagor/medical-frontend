"use client";

import Image from "next/image";
import {
  ArrowRight,
  Activity,
  FlaskConical,
  HeartPulse,
  Stethoscope,
} from "lucide-react";
import Button from "@/components/buttons/button";
import { IMAGE } from "@/constant/image-config";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden padding pt-24">
      {/* soft bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-40" />

      <div className="relative mx-auto">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          {/* LEFT SIDE */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-light-slate/40 bg-white px-5 py-2 text-xs font-semibold tracking-wide text-primary shadow-sm">
              <span className="h-2 w-2 rounded-full bg-primary" />
              NOW ENROLLING: FALL 2024
            </div>

            {/* Heading */}
            <h1 className="text-5xl font- leading-[1.05] text-black md:text-7xl">
              Redefining <br />
              <span className="text-primary italic">Precision</span> & <br />
              <span className="text-primary italic">Compassion</span> <br />
              in Airway Care
            </h1>

            {/* Paragraph */}
            <p className="max-w-xl text-lg leading-relaxed text-light-slate">
              Experience a new standard of medical training. Where high-fidelity
              simulation meets the human side of critical care in a supportive,
              state-of-the-art environment.
            </p>

            {/* CTA */}
            <Button size="md" className="px-15">
              Get Training <ArrowRight size={18} />
            </Button>
          </div>

          {/* RIGHT SIDE */}
          <div className="relative flex justify-end">
            {/* Doctor Image */}
            <div className="relative h-170 w-100 md:w-140">
              <Image
                src={IMAGE.doctor}
                alt="Doctor"
                fill
                priority
                className="object-contain"
              />
            </div>

            {/* Floating Feature Pills */}

            {/* Advanced Airway */}
            <div className="absolute right-0 top-20 rounded-full bg-white/80 backdrop-blur-md px-6 py-3 shadow-lg border border-light-slate/30 flex items-center gap-3">
              <Activity className="text-primary" size={20} />
              <span className="text-sm font-semibold text-black">
                Advanced Airway
              </span>
            </div>

            {/* ER Training */}
            <div className="absolute left-10 top-56 rounded-full bg-white/80 backdrop-blur-md px-6 py-3 shadow-lg border border-light-slate/30 flex items-center gap-3">
              <HeartPulse className="text-primary" size={20} />
              <span className="text-sm font-semibold text-black">
                ER Training
              </span>
            </div>

            {/* Clinical Excellence */}
            <div className="absolute left-0 bottom-28 rounded-full bg-white/80 backdrop-blur-md px-6 py-3 shadow-lg border border-light-slate/30 flex items-center gap-3">
              <Stethoscope className="text-primary" size={20} />
              <span className="text-sm font-semibold text-black">
                Clinical Excellence
              </span>
            </div>

            {/* Simulation Lab */}
            <div className="absolute right-0 bottom-16 rounded-full bg-white/80 backdrop-blur-md px-6 py-3 shadow-lg border border-light-slate/30 flex items-center gap-3">
              <FlaskConical className="text-primary" size={20} />
              <span className="text-sm font-semibold text-black">
                Simulation Lab
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
