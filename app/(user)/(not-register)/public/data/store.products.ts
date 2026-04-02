import {
  Brand,
  Category,
  Product,
} from "@/app/(user)/(not-register)/public/types/store.product";
import { IMAGE } from "@/constant/image-config";

export const CATEGORIES: Category[] = [
  "Respiratory",
  "Wound Care",
  "Diagnostics",
  "Surgical",
  "PPE",
  "Equipment",
];

export const BRANDS: Brand[] = [
  "3M Medical",
  "Welch Allyn",
  "MedLine",
  "B. Braun",
];

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Nitrile Exam Gloves",
    category: "Respiratory",
    brand: "MedLine",
    price: 12.99,
    description:
      "High tactile sensitivity, chemically resistant, latex-free formulation for clinical use.",
    imageUrl: IMAGE.hand_gloves,
    badge: "BEST SELLER",
    stock: "in_stock",
  },
  {
    id: "p2",
    name: "Digital Otoscope Pro",
    category: "Diagnostics",
    brand: "Welch Allyn",
    price: 145,
    description:
      "Fiber optic illumination, 3x magnification, includes hard carrying case.",
    imageUrl: IMAGE.hand_gloves,
    badge: null,
    stock: "in_stock",
  },
  {
    id: "p3",
    name: "N95 Surgical Respirator",
    category: "PPE",
    brand: "3M Medical",
    price: 24.5,
    oldPrice: 24.5,
    description:
      "NIOSH approved, fluid resistant, adjustable nose clip for secure fit.",
    imageUrl: IMAGE.hand_gloves,
    badge: null,
    stock: "out_of_stock",
  },
  {
    id: "p4",
    name: "Kelly Forceps - Curved",
    category: "Surgical",
    brand: "B. Braun",
    price: 18.75,
    description:
      "Stainless steel, 5.5 inch length, serrated jaws for secure grip.",
    imageUrl: IMAGE.hand_gloves,
    badge: null,
    stock: "in_stock",
  },
  {
    id: "p5",
    name: "Sterile Bandages",
    category: "Wound Care",
    brand: "MedLine",
    price: 4.5,
    description:
      "Flexible fabric, assorted sizes for minor wounds. 100 count box.",
    imageUrl: IMAGE.hand_gloves,
    badge: "BULK SAVE",
    stock: "in_stock",
  },
  {
    id: "p6",
    name: "Cardiology Stethoscope IV",
    category: "Equipment",
    brand: "Welch Allyn",
    price: 189,
    description:
      "Superior acoustic performance, dual-lumen tubing, tunable diaphragm.",
    imageUrl: IMAGE.hand_gloves,
    badge: null,
    stock: "in_stock",
  },
  {
    id: "p7",
    name: "Pulse Oximeter Kit",
    category: "Diagnostics",
    brand: "MedLine",
    price: 39,
    description:
      "Fast readings, bright display, includes lanyard and carrying pouch.",
    imageUrl: IMAGE.hand_gloves,
    badge: null,
    stock: "in_stock",
  },
  {
    id: "p8",
    name: "Surgical Mask Box",
    category: "PPE",
    brand: "3M Medical",
    price: 9.99,
    description:
      "Comfort fit, breathable layers, everyday clinical protection.",
    imageUrl: IMAGE.hand_gloves,
    badge: null,
    stock: "in_stock",
  },
  {
    id: "p9",
    name: "Nebulizer Set",
    category: "Respiratory",
    brand: "B. Braun",
    price: 59,
    description:
      "Efficient aerosol delivery, easy-clean components, adult mask included.",
    imageUrl: IMAGE.hand_gloves,
    badge: null,
    stock: "in_stock",
  },
  {
    id: "p10",
    name: "Wound Dressing Pack",
    category: "Wound Care",
    brand: "B. Braun",
    price: 22,
    description:
      "Sterile dressing essentials for quick wound management in clinics.",
    imageUrl: IMAGE.hand_gloves,
    badge: null,
    stock: "in_stock",
  },
  {
    id: "p11",
    name: "Laryngoscope Handle",
    category: "Equipment",
    brand: "Welch Allyn",
    price: 129,
    description:
      "Durable grip, consistent power delivery, compatible with standard blades.",
    imageUrl: IMAGE.hand_gloves,
    badge: "BEST SELLER",
    stock: "in_stock",
  },
  {
    id: "p12",
    name: "Suture Removal Kit",
    category: "Surgical",
    brand: "MedLine",
    price: 14.25,
    description:
      "Sterile scissors and forceps in a compact kit for outpatient care.",
    imageUrl: IMAGE.hand_gloves,
    badge: null,
    stock: "in_stock",
  },
];
