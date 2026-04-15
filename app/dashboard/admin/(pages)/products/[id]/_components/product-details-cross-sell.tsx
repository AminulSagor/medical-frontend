import type { ProductDetails } from "../_types/product-details.types";
import Panel from "./_shared/panel";

type Props = {
    data: ProductDetails;
};

export default function ProductDetailsCrossSell({ data }: Props) {
    return (
        <Panel title="CROSS-SELL MATRIX">
            <div className="space-y-4">
                <div className="rounded-xl bg-white p-4 ring-1 ring-slate-200/70">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        FREQUENTLY BOUGHT TOGETHER
                    </p>
                    <div className="mt-3 space-y-2">
                        {data.crossSell.frequentlyBoughtTogether.length > 0 ? (
                            data.crossSell.frequentlyBoughtTogether.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-3 ring-1 ring-slate-200/70"
                                >
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">
                                            {item.title}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {item.priceLabel ?? item.subtitle}
                                        </p>
                                    </div>
                                    <span className="text-xs font-semibold text-[var(--primary)]">
                                        +
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-slate-500">No cross-sell items found.</p>
                        )}
                    </div>
                </div>

                <div className="rounded-xl bg-white p-4 ring-1 ring-slate-200/70">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        COMPLETE YOUR SETUP
                    </p>
                    <div className="mt-3 space-y-2">
                        {data.crossSell.completeSetup.length > 0 ? (
                            data.crossSell.completeSetup.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-3 ring-1 ring-slate-200/70"
                                >
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">
                                            {item.title}
                                        </p>
                                        <p className="text-xs text-slate-500">{item.subtitle}</p>
                                    </div>
                                    <span className="text-xs font-semibold text-slate-400">
                                        ↗
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-slate-500">No setup items found.</p>
                        )}
                    </div>
                </div>
            </div>
        </Panel>
    );
}