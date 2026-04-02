const sources = [
    { label: "Organic Search", value: 45 },
    { label: "Direct", value: 30 },
    { label: "Social/LinkedIn", value: 15 },
    { label: "Email", value: 10 },
];

export default function TrafficSourcesCard() {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div>
                <h2 className="text-sm font-semibold text-slate-900">Traffic Sources</h2>
                <p className="text-xs text-slate-500">Where are doctors coming from?</p>
            </div>

            {/* Donut */}
            <div className="mt-6 grid place-items-center">
                <div className="relative grid h-[180px] w-[180px] place-items-center rounded-full bg-slate-400/60">
                    <div className="grid h-[130px] w-[130px] place-items-center rounded-full bg-white">
                        <div className="text-center">
                            <div className="text-2xl font-semibold text-slate-900">12.4k</div>
                            <div className="text-xs font-semibold tracking-wide text-slate-500">
                                VISITS
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="mt-6 space-y-2">
                {sources.map((s, idx) => (
                    <div key={s.label} className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                            <span
                                className={[
                                    "h-2 w-2 rounded-full",
                                    idx === 0
                                        ? "bg-[var(--primary)]"
                                        : idx === 1
                                            ? "bg-slate-900"
                                            : idx === 2
                                                ? "bg-sky-300"
                                                : "bg-slate-300",
                                ].join(" ")}
                            />
                            {s.label}
                        </div>
                        <div className="text-xs font-semibold text-slate-700">{s.value}%</div>
                    </div>
                ))}
            </div>
        </div>
    );
}