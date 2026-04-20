import type { ProductDetails } from "../_types/product-details.types";
import Panel from "./_shared/panel";

type Props = {
    data: ProductDetails;
};

export default function ProductDetailsOrganization({ data }: Props) {
    return (
        <Panel title="ORGANIZATION">
            <div className="space-y-4">
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-4 ring-1 ring-slate-200/70">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                            {data.organization.availabilityLabel}
                        </p>
                        <p className="mt-2 text-sm font-extrabold text-[var(--primary)]">
                            {data.organization.availabilityValue}
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-white px-4 py-4 ring-1 ring-slate-200/70">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                            {data.organization.deptLabel}
                        </p>
                        <p className="mt-2 text-sm font-bold text-slate-900">
                            {data.organization.deptValue}
                        </p>
                    </div>
                </div>
            </div>
        </Panel>
    );
}