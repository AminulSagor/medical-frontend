import { Product } from "@/app/public/types/equipment.types";
import { IMAGE } from "@/constant/image-config";

export const SHOP_THE_LAB_PRODUCTS: Product[] = [
  {
    id: "laryngoscope-blades-set",
    category: "SIMULATION",
    title: "Laryngoscope Blades Set",
    price: 249,
    imageSrc: IMAGE.product_1,
    imageAlt: "Laryngoscope Blades Set",
    detailsHref: "/public/store/product-details/laryngoscope-blades-set",
  },
  {
    id: "training-mannequin",
    category: "TRAINING",
    title: "Adv. Training Mannequin",
    price: 3499,
    imageSrc: IMAGE.product_2,
    imageAlt: "Adv. Training Mannequin",
    detailsHref: "/public/store/product-details/training-mannequin",
  },
  {
    id: "video-laryngoscope",
    category: "EQUIPMENT",
    title: "Video Laryngoscope",
    price: 1150,
    imageSrc: IMAGE.product_2,
    imageAlt: "Video Laryngoscope",
    detailsHref: "/public/store/product-details/video-laryngoscope",
  },
  {
    id: "airway-kit-pro",
    category: "SUPPLIES",
    title: "Airway Kit Pro",
    price: 185,
    imageSrc: IMAGE.product_2,
    imageAlt: "Airway Kit Pro",
    detailsHref: "/public/store/product-details/airway-kit-pro",
  },
];
