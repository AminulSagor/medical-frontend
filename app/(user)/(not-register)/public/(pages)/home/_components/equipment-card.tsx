"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Package } from "lucide-react";
import { motion } from "motion/react";
import Card from "@/components/cards/card";
import { Product } from "@/app/(user)/(not-register)/public/types/equipment.types";

function money(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function categoryToneClass(category: Product["category"]) {
  return "text-primary";
}

export default function EquipmentCard({
  product,
  onToggleWish,
  onAddToCart,
  wished = false,
}: {
  product: Product;
  wished?: boolean;
  onToggleWish?: (id: string) => void;
  onAddToCart?: (id: string) => void;
}) {
  return (
    <motion.div
      whileHover="hover"
      initial="rest"
      animate="rest"
      className="h-full group"
    >
      <Card
        shape="soft"
        className="relative h-full overflow-hidden border border-light-slate/15 p-0"
      >
        <motion.div
          variants={{
            rest: { y: 0, scale: 1 },
            hover: { y: -8, scale: 1.01 },
          }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="h-full"
        >
          <div className="relative h-full p-6">
            <motion.button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleWish?.(product.id);
              }}
              whileHover={{ scale: 1.08, y: -1 }}
              whileTap={{ scale: 0.92 }}
              transition={{ duration: 0.18 }}
              className="absolute right-4 top-4 z-20 grid h-9 w-9 place-items-center rounded-full border border-light-slate/20 bg-white hover:bg-light-slate/10 active:scale-95 transition"
              aria-label="Add to wishlist"
            >
              <motion.span
                animate={
                  wished
                    ? { scale: [1, 1.2, 1], rotate: [0, -8, 8, 0] }
                    : { scale: 1, rotate: 0 }
                }
                transition={{ duration: 0.35 }}
                className="inline-flex"
              >
                <Heart
                  size={16}
                  className={wished ? "text-primary" : "text-light-slate"}
                  fill={wished ? "currentColor" : "none"}
                />
              </motion.span>
            </motion.button>

            <div className="flex items-center justify-center">
              <motion.div
                variants={{
                  rest: { scale: 1 },
                  hover: { scale: 1.08 },
                }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="grid h-24 w-24 place-items-center rounded-full bg-light-slate/15"
              >
                {product.imageSrc ? (
                  <div className="relative h-16 w-16 overflow-hidden rounded-full">
                    <Image
                      src={product.imageSrc}
                      alt={product.imageAlt || product.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <Package className="text-light-slate" size={22} />
                )}
              </motion.div>
            </div>

            <motion.p
              variants={{
                rest: { opacity: 0.9, y: 0 },
                hover: { opacity: 1, y: -1 },
              }}
              transition={{ duration: 0.22 }}
              className={[
                "mt-6 text-[11px] font-extrabold tracking-[0.18em]",
                categoryToneClass(product.category),
              ].join(" ")}
            >
              {product.category}
            </motion.p>

            <motion.h3
              variants={{
                rest: { y: 0 },
                hover: { y: -2 },
              }}
              transition={{ duration: 0.22 }}
              className="mt-2 text-base font-semibold text-black"
            >
              <span className="transition-colors duration-200 group-hover:text-primary">
                {product.title}
              </span>
            </motion.h3>

            <div className="mt-5 flex items-center justify-between">
              <motion.div
                variants={{
                  rest: { y: 0 },
                  hover: { y: -1 },
                }}
                transition={{ duration: 0.22 }}
                className="text-lg font-bold text-black"
              >
                {money(product.price)}
              </motion.div>

              <div className="relative h-10 w-10 overflow-hidden">
                <motion.button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onAddToCart?.(product.id);
                  }}
                  variants={{
                    rest: { opacity: 0, y: 18, pointerEvents: "none" as const },
                    hover: { opacity: 1, y: 0, pointerEvents: "auto" as const },
                  }}
                  transition={{ duration: 0.21, ease: "easeOut" }}
                  whileTap={{ scale: 0.94 }}
                  className="relative z-20 grid h-10 w-10 place-items-center rounded-full bg-primary text-white hover:opacity-90 active:scale-95 transition"
                  aria-label="Add to cart"
                >
                  <ShoppingCart size={18} />
                </motion.button>
              </div>
            </div>

            <Link
              href={product.detailsHref}
              className="absolute inset-0 z-10"
              aria-label={`View ${product.title}`}
            />
          </div>
        </motion.div>
      </Card>
    </motion.div>
  );
}
