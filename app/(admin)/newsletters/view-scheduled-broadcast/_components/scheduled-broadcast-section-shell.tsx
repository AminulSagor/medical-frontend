import React from "react";

type Props = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

export default function ScheduledBroadcastSectionShell({
  title,
  children,
  className = "",
}: Props) {
  return (
    <section
      className={`rounded-[26px] border border-white/70 bg-white/90 p-6 shadow-[0_10px_36px_rgba(15,23,42,0.04)] ${className}`}
    >
      <div className="mb-5">
        <h2 className="text-[18px] font-semibold text-slate-800">{title}</h2>
        <div className="mt-2 h-[3px] w-11 rounded-full bg-[#14b8ad]" />
      </div>

      {children}
    </section>
  );
}