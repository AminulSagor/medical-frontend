export default function CourseDetailsRowLine({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="space-y-1 py-1.5">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400">
                {label}
            </p>
            <p className="text-[14px] font-medium leading-6 text-slate-700">{value}</p>
        </div>
    );
}
