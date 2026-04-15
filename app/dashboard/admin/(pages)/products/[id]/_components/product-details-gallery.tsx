import Image from "next/image";
import type { ProductDetails } from "../_types/product-details.types";
import Panel from "./_shared/panel";
import { cx } from "./_shared/product-details.utils";

type Props = {
    data: ProductDetails;
};

export default function ProductDetailsGallery({ data }: Props) {
    return (
        <Panel title="">
            <div className="space-y-4">
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-50 ring-1 ring-slate-200">
                    {data.images[0]?.url ? (
                        <Image
                            src={data.images[0].url}
                            alt={data.name}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="absolute inset-0 grid place-items-center text-slate-300">
                            <span className="text-xs font-semibold">IMAGE</span>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-4 gap-3">
                    {data.images.map((img, idx) => (
                        <div
                            key={img.id}
                            className={cx(
                                "relative aspect-square overflow-hidden rounded-xl ring-1",
                                idx === 0
                                    ? "ring-[var(--primary)] bg-[var(--primary-50)]"
                                    : "ring-slate-200 bg-slate-50",
                            )}
                        >
                            {img.url ? (
                                <Image
                                    src={img.url}
                                    alt={`${data.name} ${idx + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            ) : null}

                            {img.label ? (
                                <div className="absolute inset-0 grid place-items-center bg-white/70 text-[11px] font-extrabold text-[var(--primary)]">
                                    {img.label}
                                </div>
                            ) : null}
                        </div>
                    ))}
                </div>
            </div>
        </Panel>
    );
}