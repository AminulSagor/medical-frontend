"use client";

import { Phone } from "lucide-react";

export default function ContactSupportButton() {
  return (
    <button
      type="button"
      onClick={() => console.log("Contact Support")}
      className="flex h-12 w-full items-center justify-center gap-3 rounded-full bg-white/10 text-[15px] font-extrabold text-white ring-1 ring-white/10 hover:bg-white/15"
    >
      <Phone className="h-4 w-4" />
      Contact Support
    </button>
  );
}