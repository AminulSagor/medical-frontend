export default function SessionPill({
  dateRange,
  title,
  timeRange,
}: {
  dateRange: string;
  title: string;
  timeRange: string;
}) {
  return (
    <div className="w-[170px] rounded-[22px] bg-[#35BEEA] px-5 py-4 text-center text-white shadow-sm">
      <div className="text-[10px] font-extrabold tracking-[0.22em] opacity-95">
        {dateRange}
      </div>

      <div className="mt-2 text-[16px] font-extrabold leading-[1.05]">
        {title}
      </div>

      <div className="mt-2 text-[11px] font-semibold tracking-wide opacity-95">
        {timeRange}
      </div>
    </div>
  );
}