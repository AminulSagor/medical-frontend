export default function CourseDetailsRowLine({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-start justify-between gap-4 py-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                {label}
            </p>
            <p className="text-sm font-semibold text-slate-900">{value}</p>
        </div>
    );
}