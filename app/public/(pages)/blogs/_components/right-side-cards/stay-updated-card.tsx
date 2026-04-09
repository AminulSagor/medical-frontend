"use client";

import { useState } from "react";

export default function StayUpdatedCard() {
    const [email, setEmail] = useState("");

    return (
        <div className="rounded-[28px] bg-[#F4F6F8] p-10 shadow-[0_20px_50px_rgba(16,24,25,0.08)]">

            <div className="grid h-16 w-16 place-items-center rounded-full bg-[#E6EEF5]">
                <svg
                    width="28"
                    height="28"
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

            {/* Title */}
            <h3 className="mt-8 font-serif text-[32px] leading-[36px] font-semibold text-[#1E293B]">
                Stay Updated
            </h3>

            {/* Description */}
            <p className="mt-5 text-[18px] leading-[28px] text-[#64748B]">
                Get the latest simulation scenarios and research delivered to your inbox.
            </p>

            {/* Input */}
            <div className="mt-8">
                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="w-full rounded-full border border-[#CBD5E1] bg-[#F1F5F9] px-6 py-4 text-[18px] text-[#475569] placeholder:text-[#94A3B8] outline-none focus:border-primary"
                />
            </div>

            {/* Button */}
            <button
                type="button"
                onClick={() => setEmail("")}
                className="mt-6 w-full rounded-full bg-[#0F172A] px-6 py-4 text-[20px] font-medium text-white shadow-[0_10px_25px_rgba(0,0,0,0.25)] transition hover:brightness-110 active:scale-95"
            >
                Subscribe
            </button>
        </div>
    );
}