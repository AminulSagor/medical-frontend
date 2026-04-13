import { useMemo } from "react";

export default function SeatMap({ capacity }: { capacity: number }) {
    const dots = useMemo(() => {
        const total = Math.min(40, Math.max(16, capacity));
        return Array.from({ length: total }, (_, index) => index);
    }, [capacity]);

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Visual Seat Map
            </p>

            <div className="mt-3 grid grid-cols-8 gap-2">
                {dots.map((dot) => (
                    <span
                        key={dot}
                        className="h-2.5 w-2.5 rounded-full bg-[var(--primary)]/60"
                        title="Available"
                    />
                ))}
            </div>

            <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[var(--primary)]/60" />
                    Available
                </div>

                <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                    Overflow
                </div>
            </div>
        </div>
    );
}