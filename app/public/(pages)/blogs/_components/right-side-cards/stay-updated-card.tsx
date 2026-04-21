"use client";

import { useState } from "react";

export default function StayUpdatedCard() {
  const [email, setEmail] = useState("");

  return (
    <div className="rounded-[24px] bg-white p-6  border border-slate-200">
      <div className="grid h-12 w-12 place-items-center rounded-full bg-[#E6EEF5]">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#3BAFD0"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 6h16v12H4z" />
          <path d="M22 6l-10 7L2 6" />
        </svg>
      </div>

      <h3 className="mt-5 font-serif text-[22px] leading-[28px] font-semibold text-[#1E293B]">
        Stay Updated
      </h3>

      <p className="mt-3 text-[14px] leading-6 text-[#64748B]">
        Get the latest simulation scenarios and research delivered to your
        inbox.
      </p>

      <div className="mt-5">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          className="w-full rounded-full border border-[#CBD5E1] bg-[#F8FAFC] px-5 py-3 text-[14px] text-[#475569] placeholder:text-[#94A3B8] outline-none focus:border-primary"
        />
      </div>

      <button
        type="button"
        onClick={() => setEmail("")}
        className="mt-4 w-full rounded-full bg-[#0F172A] px-5 py-3 text-[15px] font-medium text-white shadow-[0_8px_20px_rgba(0,0,0,0.18)] transition hover:brightness-110 active:scale-95"
      >
        Subscribe
      </button>
    </div>
  );
}
