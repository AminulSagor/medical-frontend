import type { ProductDetails } from "../_types/product-details.types";
import Panel from "./_shared/panel";

type Props = {
    data: ProductDetails;
};

export default function ProductDetailsClinicalRecord({ data }: Props) {
    return (
        <Panel title="CLINICAL PRODUCT RECORD">
            <div className="space-y-4">
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
                    {data.name}
                </h2>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    CLINICAL DESCRIPTION
                </p>
                <p className="whitespace-pre-line text-sm leading-6 text-slate-600">
                    {data.description}
                </p>
            </div>
        </Panel>
    );
}