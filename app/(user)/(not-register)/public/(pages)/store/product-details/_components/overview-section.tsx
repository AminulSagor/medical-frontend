import {
  OverviewFeature,
  ProductDetails,
} from "@/app/(user)/(not-register)/public/types/product.details";
import Card from "@/components/cards/card";
import { Droplet, Ban, Sparkles, Activity } from "lucide-react";

function FeatureIcon({ icon }: { icon: OverviewFeature["icon"] }) {
  const cls = "h-5 w-5 text-primary";
  if (icon === "droplet") return <Droplet className={cls} />;
  if (icon === "ban") return <Ban className={cls} />;
  if (icon === "sparkle") return <Sparkles className={cls} />;
  return <Activity className={cls} />;
}

export default function OverviewSection({
  product,
}: {
  product: ProductDetails;
}) {
  return (
    <section className="mt-10">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-bold text-black">
          {product.overview.title}
        </h2>
      </div>

      <div className="mt-6 max-w-4xl text-base leading-relaxed text-light-slate whitespace-pre-line">
        {product.overview.description}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        {product.overview.features.map((f) => (
          <Card key={f.id} className="bg-primary/5 border-primary/10">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white ring-1 ring-primary/10">
                <FeatureIcon icon={f.icon} />
              </div>

              <div>
                <div className="text-base font-semibold text-black">
                  {f.title}
                </div>
                <div className="mt-2 text-sm leading-relaxed text-light-slate">
                  {f.description}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
