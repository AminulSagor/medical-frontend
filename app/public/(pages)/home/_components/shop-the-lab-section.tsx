"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { getPublicProducts } from "@/service/public/product.service";
import { Product } from "@/app/public/types/equipment.types";
import EquipmentCard from "./equipment-card";
import { useCart } from "@/app/public/context/cart-context";
import { useWishlist } from "@/app/public/context/wishlist-context";

export default function ShopTheLabSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const response = await getPublicProducts({ limit: 4 });

        // Map backend products to the expectations of EquipmentCard
        const mappedProducts: Product[] = response.items.map((item) => ({
          id: item.id,
          category:
            (item.tags?.[0]?.toUpperCase() as any) ||
            "EQUIPMENT",
          title: item.name,
          price: Number(item.offerPrice) || Number(item.actualPrice) || 0,
          imageSrc: undefined,
          imageAlt: item.name,
          detailsHref: `/public/store/product-details/${item.id}`,
        }));

        setProducts(mappedProducts);
      } catch (error) {
        console.error("Failed to fetch products for home page:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  async function handleAddToCart(id: string) {
    try {
      await addItem(id, 1);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  }

  return (
    <section className="w-full bg-white">
      <div className="mx-auto px-6 py-14 padding">
        <div className="flex items-start justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{
              duration: 0.65,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <p className="text-sm font-bold text-primary">SHOP THE LAB</p>

            <h2 className="mt-2 text-3xl font-semibold text-black">
              Medical Simulation Equipment
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{
              duration: 0.65,
              delay: 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Link
              href="/public/store"
              className="group mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:opacity-80"
            >
              View All Products
              <motion.span
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="inline-flex"
              >
                <ArrowRight size={16} />
              </motion.span>
            </Link>
          </motion.div>
        </div>

        <div className="mt-10 min-h-[300px]">
          {loading ? (
            <div className="flex h-64 w-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid items-stretch gap-8 md:grid-cols-2 lg:grid-cols-4">
              {products.map((p, index) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 24, scale: 0.98 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <EquipmentCard
                    product={p}
                    wished={isInWishlist(p.id)}
                    onToggleWish={(id) => toggleWishlist(id)}
                    onAddToCart={handleAddToCart}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
