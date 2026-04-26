export default function OrderSummaryRow({
    label,
    value,
    highlight,
}: {
    label: string;
    value: string;
    highlight?: boolean;
}) {
    return (
        <div className="flex justify-between gap-3">
            <span className="text-slate-600">{label}</span>
            <span
                className={highlight ? "font-medium text-primary" : "text-slate-900"}
            >
                {value}
            </span>
        </div>
    );
}