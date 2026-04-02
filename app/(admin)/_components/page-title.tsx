export default function PageTitle({
    title,
    subtitle,
    align = "left",
}: {
    title: string;
    subtitle?: string;
    align?: "left" | "center";
}) {
    return (
        <div className={align === "center" ? "text-center" : "text-left"}>
            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
            {subtitle ? (
                <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
            ) : null}
        </div>
    );
}