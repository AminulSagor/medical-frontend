import type { ProductDetails } from "../_types/product-details.types";
import Panel from "./_shared/panel";

type Props = {
    data: ProductDetails;
};

export default function ProductDetailsSpecs({ data }: Props) {
    return (
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
                        {data.specs.map((spec) => (
                            <tr key={spec.id}>
                                <td className="px-4 py-4 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                    {spec.label}
                                </td>
                                <td className="px-4 py-4 text-sm font-semibold text-slate-900">
                                    {spec.value}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Panel>
    );
}