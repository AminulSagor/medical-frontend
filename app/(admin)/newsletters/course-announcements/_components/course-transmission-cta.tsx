"use client";

export default function CourseTransmissionCTA({
  onClick,
}: {
  onClick?: () => void;
}) {
  return (
    <div className="pt-8 text-center">
      <p className="text-[11px] text-slate-400">Looking for past transmissions?</p>
      <div className="mt-3 flex justify-center">
        <button
          type="button"
          onClick={onClick}
          className="inline-flex h-10 items-center justify-center rounded-xl border border-emerald-300 bg-white px-6 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-50"
        >
          VIEW ALL TRANSMISSION HISTORY <span className="ml-2">→</span>
        </button>
      </div>
    </div>
  );
}