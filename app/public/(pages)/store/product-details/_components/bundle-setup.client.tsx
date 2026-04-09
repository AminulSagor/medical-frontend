"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Check, ChevronDown, ShoppingCart } from "lucide-react";
import { ProductDetails } from "@/app/public/types/product.details";
import Card from "@/components/cards/card";
import Button from "@/components/buttons/button";

function money(n: number) {
  return `$${n.toFixed(2)}`;
}

export default function BundleSetupClient({
  product,
}: {
  product: ProductDetails;
}) {
  const [open, setOpen] = useState(true);

  const [selected, setSelected] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    product.bundle.items.forEach((i) => {
      initial[i.id] = i.selectedByDefault ?? true;
    });
    return initial;
  });

  const total = useMemo(() => {
    return product.bundle.items.reduce(
      (sum, it) => (selected[it.id] ? sum + it.price : sum),
      0,
    );
  }, [product.bundle.items, selected]);

  return (
    <Card>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex w-full items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            ◻
          </span>
          <div className="text-base font-semibold text-black">
            {product.bundle.title}
          </div>
        </div>

        <ChevronDown
          className={`h-5 w-5 text-light-slate transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open ? (
        <div className="">
          <div className="divide-y divide-slate-100">
            {product.bundle.items.map((it) => (
              <label
                key={it.id}
                className="flex cursor-pointer items-center gap-4 py-5"
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
                  {selected[it.id] ? <Check className="h-4 w-4" /> : null}
                </span>

                <div className="relative h-12 w-12 overflow-hidden rounded-2xl bg-light-slate/10">
                  <Image
                    src={it.imageUrl}
                    alt={`Bundle item - ${it.title}`}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-black">
                    {it.title}
                  </div>
                  <div className="mt-0.5 truncate text-xs text-light-slate">
                    {it.subtitle}
                  </div>
                </div>

                <div className="text-sm font-semibold text-black">
                  {money(it.price)}
                </div>

                <input
                  className="hidden"
                  type="checkbox"
                  checked={!!selected[it.id]}
                  onChange={() =>
                    setSelected((p) => ({
                      ...p,
                      [it.id]: !p[it.id],
                    }))
                  }
                />
              </label>
            ))}
          </div>

          <div className="mt-6">
            <Button className="h-14 w-full bg-primary text-white" shape="pill">
              <ShoppingCart className="h-5 w-5" />
              {product.bundle.ctaLabel}
              <span className="ml-2 text-white/80">|</span>
              <span className="text-white/90">
                Bundle Price: {money(total)}
              </span>
            </Button>

            <div className="mt-3 text-center text-[11px] font-semibold tracking-widest text-light-slate">
              {product.bundle.savingsLabel}
            </div>
          </div>
        </div>
      ) : null}
    </Card>
  );
}
