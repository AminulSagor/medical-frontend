import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import Card from "@/components/cards/card";
import { IMAGE } from "@/constant/image-config";

/* =========================
   Types (same file)
========================= */
type FbtItem = {
  id: string;
  categoryLabel: string; // e.g. "EQUIPMENT"
  title: string;
  price: number;
  imageUrl: string;
};

/* =========================
   Data (same file)
   (Design-only mock)
========================= */
const FBT_ITEMS: FbtItem[] = [
  {
    id: "fbt-1",
    categoryLabel: "EQUIPMENT",
    title: "Cardiology Stethoscope IV",
    price: 189.0,
    imageUrl: IMAGE.hand_gloves,
  },
  {
    id: "fbt-2",
    categoryLabel: "DIAGNOSTICS",
    title: "Digital Otoscope Pro",
    price: 145.0,
    imageUrl: IMAGE.hand_gloves,
  },
  {
    id: "fbt-3",
    categoryLabel: "CONSUMABLES",
    title: "Nitrile Exam Gloves",
    price: 12.99,
    imageUrl: IMAGE.hand_gloves,
  },
  {
    id: "fbt-4",
    categoryLabel: "SURGICAL",
    title: "Kelly Forceps - Curved",
    price: 18.75,
    imageUrl: IMAGE.hand_gloves,
  },
];

function money(n: number) {
  return `$${n.toFixed(2)}`;
}

/* =========================
   Component 
========================= */
export default function FrequentlyBoughtTogether() {
  return (
    <section className="mt-12">
      <h2 className="text-lg font-semibold text-black">
        Frequently Bought Together
      </h2>

      <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {FBT_ITEMS.map((item) => (
          <div
            key={item.id}
            className="bg-white
        shadow-sm
        border border-slate-100 rounded-2xl overflow-hidden"
          >
            {/* Image */}
            <div className="relative aspect-[16/10] w-full bg-light-slate/10">
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 25vw"
              />
            </div>

            {/* Body */}
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

              {/* Small cart button */}
              <button
                type="button"
                aria-label="Add to cart"
                className="
                  absolute bottom-4 right-4
                  inline-flex h-9 w-9 items-center justify-center
                  rounded-full
                  border border-slate-200
                  bg-white
                  shadow-sm
                  transition-all duration-150
                  hover:bg-light-slate/10
                  active:scale-95
                "
              >
                <ShoppingCart className="h-4 w-4 text-light-slate" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
