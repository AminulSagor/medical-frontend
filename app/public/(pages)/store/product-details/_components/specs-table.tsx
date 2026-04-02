import { ProductDetails } from "@/app/public/types/product.details";
import Card from "@/components/cards/card";

export default function SpecsTable({ product }: { product: ProductDetails }) {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold text-black">{product.specs.title}</h2>

      <Card className="mt-6 p-0 overflow-hidden">
        <div className="divide-y divide-slate-100">
          {product.specs.rows.map((r) => (
            <div
              key={r.id}
              className="grid grid-cols-1 gap-2 px-6 py-5 md:grid-cols-12 md:gap-4"
            >
              <div className="md:col-span-4 text-sm font-semibold text-black">
                {r.label}
              </div>
              <div className="md:col-span-8 text-sm text-light-slate">
                {r.value}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}
