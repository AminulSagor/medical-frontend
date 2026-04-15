// data/product-details.mock.ts

import { ProductDetails } from "@/app/public/types/product.details";
import { IMAGE } from "@/constant/image-config";

export const PRODUCT_DETAILS_MOCK: ProductDetails = {
  id: "lma-supreme",
  breadcrumbs: [
    { label: "Home", href: "/public/home" },
    { label: "Shop", href: "/public/store" },
    { label: "Airway Management", href: "/store?category=airway-management" },
    { label: "Laryngeal Mask Airway Supreme" },
  ],

  title: "Laryngeal Mask Airway\nSupreme",
  sku: "LMA-SUP-04",
  categoryLabel: "Airway Management",

  badges: [
    { id: "professional", label: "PROFESSIONAL GRADE", tone: "primary" },
    {
      id: "workshop",
      label: "USED IN WORKSHOP",
      tone: "dark",
      icon: "workshop",
    },
  ],

  rating: {
    value: 5.0,
    reviewsCount: 124,
    label: "Physician Reviews",
  },

  price: {
    actualLabel: "Actual price",
    offerLabel: "Offer Price / unit",
    strikePrice: 45.0,
    offerPrice: 45.0,
  },

  stock: {
    label: "IN STOCK - READY TO SHIP FROM DALLAS, TX",
  },

  media: {
    heroImageUrl: IMAGE.hand_gloves,
    heroHasPlayButton: true,
    thumbnails: [
      {
        id: "t1",
        imageUrl: IMAGE.hand_gloves,
      },
      {
        id: "t2",
        imageUrl: IMAGE.hand_gloves,
      },
      {
        id: "t3",
        imageUrl: IMAGE.hand_gloves,
      },
      {
        id: "t4",
        imageUrl: IMAGE.hand_gloves,
      },
    ],
  },

  bulkPricing: {
    title: "Bulk Pricing Calculator",
    tiers: [
      {
        id: "50",
        minUnitsLabel: "50+ units",
        price: 42.0,
        discountLabel: "(-6%)",
      },
      {
        id: "100",
        minUnitsLabel: "100+ units",
        price: 38.5,
        discountLabel: "(-15%)",
      },
    ],
  },

  guarantee: {
    title: "Clinical Guarantee",
    description:
      "Authorized distributor. Sterility guaranteed upon delivery. 30-day return policy for unopened sterile packaging.",
  },

  overview: {
    title: "Product Overview & Clinical Indication",
    description:
      "The Laryngeal Mask Airway Supreme is a second-generation gastric access supraglottic airway device designed to redefine safety and efficiency in airway management. It uniquely combines the high seal pressures of the LMA ProSeal with the ease of insertion found in the LMA Fastrach.\n\nThis device is engineered for clinical excellence in both elective and emergency airway management scenarios. It features a built-in drain tube to provide an added margin of safety by allowing for the effective drainage of gastric contents, significantly reducing the risk of aspiration.",
    features: [
      {
        id: "f1",
        title: "Enhanced Seal",
        description:
          "Anatomically shaped cuff designed to provide high seal pressures up to 30 cm H2O, facilitating positive pressure ventilation.",
        icon: "droplet",
      },
      {
        id: "f2",
        title: "Gastric Access",
        description:
          "Integrated drain tube designed to channel fluid away from the airway and allow for gastric decompression via suction.",
        icon: "stomach",
      },
      {
        id: "f3",
        title: "Easy Insertion",
        description:
          "Formed semi-rigid tube aids insertion and prevents kinking during placement, reducing time to effective ventilation.",
        icon: "sparkle",
      },
      {
        id: "f4",
        title: "Single Use",
        description:
          "Sterile, single-use design minimizes cross-contamination risk and eliminates reprocessing costs.",
        icon: "ban",
      },
    ],
  },

  specs: {
    title: "Technical Specifications",
    rows: [
      {
        id: "s1",
        label: "Patient Weight Range",
        value: "30kg - 50kg (Size 3), 50kg - 70kg (Size 4), >70kg (Size 5)",
      },
      {
        id: "s2",
        label: "Max Cuff Inflation Volume",
        value: "20ml (Size 3), 30ml (Size 4), 40ml (Size 5)",
      },
      { id: "s3", label: "Max Intracuff Pressure", value: "60 cm H2O" },
      {
        id: "s4",
        label: "Material Composition",
        value: "Medical Grade PVC, Latex-Free, Phthalate-Free",
      },
      {
        id: "s5",
        label: "Sterilization Method",
        value: "Ethylene Oxide (EtO)",
      },
    ],
  },
};
