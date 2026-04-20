import type { ProductDetails } from "../_types/product-details.types";

type Props = {
    data: ProductDetails;
};

export default function ProductDetailsPricing({ data }: Props) {
    return (
        <section className="overflow-hidden rounded-2xl shadow-sm ring-1 ring-slate-200/60">
            <div className="flex items-center justify-between bg-slate-900 px-6 py-4">
                <p className="text-[11px] font-extrabold uppercase tracking-wide text-white/90">
                    {data.pricingStrip.statusLabel}
                </p>
                <p className="text-[11px] font-semibold text-white/70">
                    {data.pricingStrip.skuLabel}
                </p>
            </div>

            <div className="bg-white p-6">
                <div className="grid gap-4 md:grid-cols-3">
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                            PUBLIC PRICE
                        </p>
                        <p className="mt-2 text-xl font-extrabold text-slate-300 line-through">
                            {data.pricingStrip.publicPriceLabel}
                        </p>
                    </div>

                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--primary)]">
                            MEMBER PRICE
                        </p>
                        <p className="mt-2 text-3xl font-extrabold text-slate-900">
                            {data.pricingStrip.memberPriceLabel}
                        </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200/70">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                            CURRENT STOCK
                        </p>
                        <div className="mt-2 flex items-end gap-2">
                            <p className="text-3xl font-extrabold text-slate-900">
                                {data.pricingStrip.currentStockLabel}
                            </p>
                            <p className="pb-1 text-xs font-semibold text-slate-400">UNITS</p>
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                        BULK PRICING TIERS
                    </p>
                    <div className="mt-3 grid gap-4 md:grid-cols-3">
                        {data.bulkTiers.map((tier) => (
                            <div
                                key={tier.id}
                                className="rounded-2xl bg-white p-4 text-center ring-1 ring-slate-200/70"
                            >
                                <p className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">
                                    {tier.qtyLabel}
                                </p>
                                <p className="mt-2 text-sm font-extrabold text-slate-900">
                                    {tier.priceLabel}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}