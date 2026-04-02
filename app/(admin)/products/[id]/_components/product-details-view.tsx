import Image from "next/image";
import Link from "next/link";
import type { ProductDetails } from "../_types/product-details.types";
import { ArrowLeft, ChevronRight, Pencil, ShoppingCart, CalendarDays, BadgeCheck } from "lucide-react";

function cx(...parts: Array<string | false | null | undefined>) {
    return parts.filter(Boolean).join(" ");
}

function StatCard({
    label,
    value,
    sub,
    icon,
    iconTone = "teal",
}: {
    label: string;
    value: string;
    sub?: string;
    icon: React.ReactNode;
    iconTone?: "teal" | "dark" | "slate";
}) {
    const tone =
        iconTone === "dark"
            ? "bg-slate-900 text-white"
            : iconTone === "slate"
                ? "bg-white text-slate-700 ring-1 ring-slate-200"
                : "bg-[var(--primary-50)] text-[var(--primary)] ring-1 ring-[var(--primary)]/15";

    return (
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/60">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
                    <p className="mt-2 text-2xl font-extrabold text-slate-900">{value}</p>
                    {sub ? <p className="mt-1 text-xs text-slate-500">{sub}</p> : null}
                </div>
                <div className={cx("grid h-12 w-12 place-items-center rounded-2xl", tone)}>{icon}</div>
            </div>
        </div>
    );
}

function Panel({
    title,
    right,
    children,
    className,
}: {
    title: string;
    right?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <section className={cx("rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/60", className)}>
            <div className="flex items-center justify-between border-b border-slate-200/70 px-6 py-4">
                <h2 className="text-sm font-extrabold tracking-tight text-slate-900">{title}</h2>
                {right}
            </div>
            <div className="px-6 py-5">{children}</div>
        </section>
    );
}

function BenefitTone(tone: "teal" | "blue" | "purple" | "orange") {
    if (tone === "blue") return "bg-blue-50 text-blue-600 ring-1 ring-blue-200/60";
    if (tone === "purple") return "bg-purple-50 text-purple-600 ring-1 ring-purple-200/60";
    if (tone === "orange") return "bg-orange-50 text-orange-600 ring-1 ring-orange-200/60";
    return "bg-[var(--primary-50)] text-[var(--primary)] ring-1 ring-[var(--primary)]/15";
}

export default function ProductDetailsView({ data }: { data: ProductDetails }) {
    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>Products</span>
                        <ChevronRight size={14} className="text-slate-300" />
                        <span>{data.breadcrumbCategory}</span>
                        <ChevronRight size={14} className="text-slate-300" />
                        <span className="truncate text-slate-700">{data.name}</span>
                    </div>

                    <div className="mt-2 flex items-center gap-3">
                        <Link
                            href="/products"
                            className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 hover:bg-white hover:ring-1 hover:ring-slate-200"
                            aria-label="Back to products"
                        >
                            <ArrowLeft size={18} />
                        </Link>
                        <h1 className="text-lg font-extrabold uppercase tracking-tight text-slate-900">PRODUCT INVENTORY</h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        href="/products"
                        className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        BACK
                    </Link>

                    <Link
                        href={`/products/edit/${data.id}`}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-4 text-sm font-extrabold text-white hover:bg-[var(--primary-hover)]"
                    >
                        <Pencil size={16} />
                        EDIT PRODUCT
                    </Link>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <StatCard
                    label="TOTAL UNITS SOLD"
                    value={data.totalUnitsSold.toLocaleString()}
                    sub="LIFETIME VOL."
                    icon={<ShoppingCart size={18} strokeWidth={2.6} />}
                    iconTone="teal"
                />
                <StatCard
                    label="TOTAL REVENUE"
                    value={data.totalRevenueLabel}
                    sub="12.5% VS PREV."
                    icon={<BadgeCheck size={18} strokeWidth={2.6} />}
                    iconTone="dark"
                />
                <StatCard
                    label="LAST SALE DATE"
                    value={data.lastSaleDateLabel}
                    sub={data.lastSaleSubLabel}
                    icon={<CalendarDays size={18} strokeWidth={2.6} />}
                    iconTone="slate"
                />
            </div>

            <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
                <div className="space-y-6">
                    <Panel title="">
                        <div className="space-y-4">
                            <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-50 ring-1 ring-slate-200">
                                <div className="absolute inset-0 grid place-items-center text-slate-300">
                                    <span className="text-xs font-semibold">IMAGE</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-3">
                                {data.images.map((img, idx) => (
                                    <div
                                        key={img.id}
                                        className={cx(
                                            "relative aspect-square overflow-hidden rounded-xl ring-1",
                                            idx === 0
                                                ? "ring-[var(--primary)] bg-[var(--primary-50)]"
                                                : "ring-slate-200 bg-slate-50"
                                        )}
                                    >
                                        {img.label ? (
                                            <div className="absolute inset-0 grid place-items-center text-[11px] font-extrabold text-[var(--primary)]">
                                                {img.label}
                                            </div>
                                        ) : null}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Panel>

                    <Panel title="ORGANIZATION">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-4 ring-1 ring-slate-200/70">
                                <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                        {data.organization.availabilityLabel}
                                    </p>
                                    <p className="mt-2 text-sm font-extrabold text-[var(--primary)]">{data.organization.availabilityValue}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between rounded-xl bg-white px-4 py-4 ring-1 ring-slate-200/70">
                                <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{data.organization.deptLabel}</p>
                                    <p className="mt-2 text-sm font-bold text-slate-900">{data.organization.deptValue}</p>
                                </div>
                            </div>
                        </div>
                    </Panel>

                    <Panel title="CROSS-SELL MATRIX">
                        <div className="space-y-4">
                            <div className="rounded-xl bg-white p-4 ring-1 ring-slate-200/70">
                                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">FREQUENTLY BOUGHT TOGETHER</p>
                                <div className="mt-3 space-y-2">
                                    {data.crossSell.frequentlyBoughtTogether.map((x) => (
                                        <div key={x.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-3 ring-1 ring-slate-200/70">
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900">{x.title}</p>
                                                <p className="text-xs text-slate-500">{x.priceLabel ?? x.subtitle}</p>
                                            </div>
                                            <span className="text-xs font-semibold text-[var(--primary)]">+</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-xl bg-white p-4 ring-1 ring-slate-200/70">
                                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">COMPLETE YOUR SETUP</p>
                                <div className="mt-3 space-y-2">
                                    {data.crossSell.completeSetup.map((x) => (
                                        <div key={x.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-3 ring-1 ring-slate-200/70">
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900">{x.title}</p>
                                                <p className="text-xs text-slate-500">{x.subtitle}</p>
                                            </div>
                                            <span className="text-xs font-semibold text-slate-400">↗</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Panel>
                </div>

                <div className="space-y-6">
                    <Panel title="CLINICAL PRODUCT RECORD">
                        <div className="space-y-4">
                            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">{data.name}</h2>
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">CLINICAL DESCRIPTION</p>
                            <p className="whitespace-pre-line text-sm leading-6 text-slate-600">{data.description}</p>
                        </div>
                    </Panel>

                    <Panel title="CLINICAL BENEFITS">
                        <div className="grid gap-4 md:grid-cols-2">
                            {data.benefits.map((b) => (
                                <div key={b.id} className="rounded-2xl bg-white p-4 ring-1 ring-slate-200/70">
                                    <div className="flex items-start gap-3">
                                        <div className={cx("grid h-10 w-10 place-items-center rounded-2xl", BenefitTone(b.tone))}>
                                            <span className="text-xs font-black">✓</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-extrabold text-slate-900">{b.title}</p>
                                            <p className="mt-1 text-xs leading-5 text-slate-500">{b.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Panel>

                    <Panel title="TECHNICAL SPECIFICATIONS" className="overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-[720px] w-full">
                                <thead className="bg-slate-50">
                                    <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                        <th className="px-4 py-3 w-[260px]"> </th>
                                        <th className="px-4 py-3"> </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200/70">
                                    {data.specs.map((s) => (
                                        <tr key={s.id}>
                                            <td className="px-4 py-4 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                                {s.label}
                                            </td>
                                            <td className="px-4 py-4 text-sm font-semibold text-slate-900">{s.value}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Panel>

                    <section className="overflow-hidden rounded-2xl shadow-sm ring-1 ring-slate-200/60">
                        <div className="flex items-center justify-between bg-slate-900 px-6 py-4">
                            <p className="text-[11px] font-extrabold uppercase tracking-wide text-white/90">
                                {data.pricingStrip.statusLabel}
                            </p>
                            <p className="text-[11px] font-semibold text-white/70">{data.pricingStrip.skuLabel}</p>
                        </div>

                        <div className="bg-white p-6">
                            <div className="grid gap-4 md:grid-cols-3">
                                <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">PUBLIC PRICE</p>
                                    <p className="mt-2 text-xl font-extrabold text-slate-300 line-through">{data.pricingStrip.publicPriceLabel}</p>
                                </div>

                                <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--primary)]">MEMBER PRICE</p>
                                    <p className="mt-2 text-3xl font-extrabold text-slate-900">{data.pricingStrip.memberPriceLabel}</p>
                                </div>

                                <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200/70">
                                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">CURRENT STOCK</p>
                                    <div className="mt-2 flex items-end gap-2">
                                        <p className="text-3xl font-extrabold text-slate-900">{data.pricingStrip.currentStockLabel}</p>
                                        <p className="pb-1 text-xs font-semibold text-slate-400">UNITS</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">BULK PRICING TIERS</p>
                                <div className="mt-3 grid gap-4 md:grid-cols-3">
                                    {data.bulkTiers.map((t) => (
                                        <div key={t.id} className="rounded-2xl bg-white p-4 text-center ring-1 ring-slate-200/70">
                                            <p className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">{t.qtyLabel}</p>
                                            <p className="mt-2 text-sm font-extrabold text-slate-900">{t.priceLabel}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}