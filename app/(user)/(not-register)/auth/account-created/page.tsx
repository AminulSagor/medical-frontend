// app/(auth)/account-created/page.tsx
"use client";

import Link from "next/link";
import { Check } from "lucide-react";

type Step = {
  n: number;
  title: string;
  desc: string;
};

const steps: Step[] = [
  {
    n: 1,
    title: "Complete Profile",
    desc: "Set up your clinical credentials and certification history.",
  },
  {
    n: 2,
    title: "Browse Courses",
    desc: "Explore our latest airway management certifications and workshops.",
  },
  {
    n: 3,
    title: "Shop Gear",
    desc: "Access exclusive clinical equipment and training manikins.",
  },
];

export default function AccountCreatedPage() {
  return (
    <div className="mx-auto w-full max-w-md px-4 py-10">
      <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_18px_60px_rgba(15,23,42,0.10)]">
        {/* Top check */}
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-50 ring-1 ring-emerald-100">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-emerald-500">
            <Check className="h-5 w-5 text-white" strokeWidth={3} />
          </div>
        </div>

        <h1 className="mt-5 text-center text-xl font-semibold text-slate-900">
          Account Created Successfully!
        </h1>

        <p className="mx-auto mt-2 max-w-sm text-center text-sm leading-6 text-slate-500">
          Welcome to the Texas Airway Institute,{" "}
          <span className="font-semibold text-slate-700">Dr. James Wilson</span>.
          Your clinical portal is now ready.
        </p>

        {/* Getting started */}
        <div className="mt-6 rounded-2xl bg-slate-50 p-5">
          <div className="flex items-center gap-2 text-[11px] font-semibold tracking-widest text-sky-600">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-sky-100 text-[11px] font-bold text-sky-700">
              ✓
            </span>
            <span>GETTING STARTED</span>
          </div>

          <div className="mt-4 space-y-4">
            {steps.map((s) => (
              <div key={s.n} className="flex gap-3">
                <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-sky-100 text-xs font-semibold text-sky-700">
                  {s.n}
                </div>

                <div className="min-w-0">
                  <div className="text-sm font-semibold text-slate-900">
                    {s.title}
                  </div>
                  <div className="mt-0.5 text-xs leading-5 text-slate-500">
                    {s.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Link
          href="/auth/sign-in"
          className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-sky-500 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(2,132,199,0.25)] hover:bg-sky-600 focus:outline-none focus:ring-4 focus:ring-sky-200"
        >
          Sign In to Your Account <span aria-hidden>→</span>
        </Link>

        {/* Support */}
        <div className="mt-4 text-center text-xs text-slate-500">
          Need help getting started?{" "}
          <Link
            href="/public/contact-us"
            className="font-semibold text-sky-600 hover:underline"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
