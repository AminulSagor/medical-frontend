"use client";

import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useCart } from "@/app/public/context/cart-context";
import { getPublicProducts } from "@/service/public/product.service";
import type { PublicProductItem } from "@/types/public/product/public-product.types";

type FbtItem = {
  id: string;
  categoryLabel: string;
  title: string;
  price: number;
  imageUrl: string;
};

type Props = {
  categoryId?: string;
  currentProductId: string;
};

function money(n: number) {
  return `$${n.toFixed(2)}`;
}

function mapProductToFbtItem(item: PublicProductItem): FbtItem {
  return {
    id: item.id,
    categoryLabel: item.categoryId?.[0]?.toUpperCase() || "PRODUCT",
    title: item.name,
    price: Number(item.offerPrice || item.actualPrice || 0),
    imageUrl:
      item.images?.[0] || item.thumbnail || "/photos/store_product.png",
  };
}

export default function FrequentlyBoughtTogether({
  categoryId,
  currentProductId,
}: Props) {
  const router = useRouter();
  const { items, syncItems } = useCart();

  const [fbtItems, setFbtItems] = useState<FbtItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!categoryId) {
      setFbtItems([]);
      return;
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);

        const response = await getPublicProducts({
          categoryIds: categoryId,
          limit: 8,
        });

        const filteredItems = response.items
          .filter((item) => item.id !== currentProductId)
          .slice(0, 4)
          .map(mapProductToFbtItem);

        setFbtItems(filteredItems);
      } catch (error) {
        console.error(
          "Failed to fetch frequently bought together products:",
          error,
        );
        setFbtItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId, currentProductId]);

  const handleAddToCart = (productId: string) => {
    const existingItem = items.find((item) => item.productId === productId);

    if (existingItem) {
      syncItems(
        items.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
      return;
    }

    syncItems([...items, { productId, quantity: 1 }]);
  };

  if (!categoryId) {
    return (
      <section className="mt-12">
        <h2 className="text-lg font-semibold text-black">
          Frequently Bought Together
        </h2>

        <div className="mt-5 rounded-2xl border border-slate-100 bg-white p-6 text-sm text-light-slate shadow-sm">
          No category found for this product, so related products are not available.
        </div>
      </section>
    );
  }

  return (
    <section className="mt-12">
      <h2 className="text-lg font-semibold text-black">
        Frequently Bought Together
      </h2>

      {loading ? (
        <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"
            >
              <div className="aspect-[16/10] w-full animate-pulse bg-slate-100" />
              <div className="p-5">
                <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />
                <div className="mt-3 h-4 w-40 animate-pulse rounded bg-slate-100" />
                <div className="mt-3 h-5 w-20 animate-pulse rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      ) : fbtItems.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-slate-100 bg-white p-6 text-sm text-light-slate shadow-sm">
          No related products found in this category.
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {fbtItems.map((item) => (
            <div
              key={item.id}
              onClick={() =>
                router.push(`/public/store/product-details/${item.id}`)
              }
              className="cursor-pointer overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"
            >
              <div className="relative aspect-[16/10] w-full bg-light-slate/10">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 25vw"
                />
              </div>

              <div className="relative p-5">
                <div className="text-[10px] font-semibold tracking-widest text-light-slate">
                  {item.categoryLabel}
                </div>

                <div className="mt-2 line-clamp-2 text-sm font-semibold text-black">
                  {item.title}
                </div>

                <div className="mt-3 text-base font-extrabold text-black">
                  {money(item.price)}
                </div>

                <button
                  type="button"
                  aria-label="Add to cart"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(item.id);
                  }}
                  className="absolute bottom-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition-all duration-150 hover:bg-light-slate/10 active:scale-95"
                >
                  <ShoppingCart className="h-4 w-4 text-light-slate" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}