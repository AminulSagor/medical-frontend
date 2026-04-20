import type { ProductDetails } from "../_types/product-details.types";
import Panel from "./_shared/panel";
import { benefitTone, cx } from "./_shared/product-details.utils";

type Props = {
    data: ProductDetails;
};

export default function ProductDetailsBenefits({ data }: Props) {
    return (
        <Panel title="CLINICAL BENEFITS">
            <div className="grid gap-4 md:grid-cols-2">
                {data.benefits.map((benefit) => (
                    <div
                        key={benefit.id}
                        className="rounded-2xl bg-white p-4 ring-1 ring-slate-200/70"
                    >
                        <div className="flex items-start gap-3">
                            <div
                                className={cx(
                                    "grid h-10 w-10 place-items-center rounded-2xl",
                                    benefitTone(benefit.tone),
                                )}
                            >
                                <span className="text-xs font-black">✓</span>
                            </div>
                            <div>
                                <p className="text-sm font-extrabold text-slate-900">
                                    {benefit.title}
                                </p>
                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                    {benefit.description}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Panel>
    );
}