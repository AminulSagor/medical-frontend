"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "./equipment-card";
import { SHOP_THE_LAB_PRODUCTS } from "@/app/(user)/(not-register)/public/data/equipment.data";

export default function ShopTheLabSection() {
  const products = useMemo(() => SHOP_THE_LAB_PRODUCTS, []);
  const [wishedIds, setWishedIds] = useState<Record<string, boolean>>({});

  function toggleWish(id: string) {
    setWishedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function addToCart(id: string) {
    console.log("add to cart:", id);
  }

  return (
    <section className="w-full bg-white">
      <div className="mx-auto px-6 py-14 padding">
        {/* header */}
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-sm  font-bold text-primary">SHOP THE LAB</p>
            <h2 className="mt-2 text-3xl font-semibold text-black">
              Medical Simulation Equipment
            </h2>
          </div>

          <Link
            href="/store"
            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:opacity-80"
          >
            View All Products <ArrowRight size={16} />
          </Link>
        </div>

        {/* cards */}
        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-4 items-stretch">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              wished={!!wishedIds[p.id]}
              onToggleWish={toggleWish}
              onAddToCart={addToCart}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
