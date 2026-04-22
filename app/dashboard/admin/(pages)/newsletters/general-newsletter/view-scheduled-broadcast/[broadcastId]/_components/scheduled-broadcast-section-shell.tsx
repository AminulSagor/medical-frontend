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
      className={`rounded-[15px] border border-slate-200 bg-white p-6 shadow-sm ${className}`}
    >
      <div className="mb-5">
        <h2 className="text-base font-semibold text-slate-800">{title}</h2>
        <div className="mt-2.5 h-0.5 w-9 rounded-full bg-[#18c3b2]" />
      </div>

      {children}
    </section>
  );
}
