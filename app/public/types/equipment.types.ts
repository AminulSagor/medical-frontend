export type ProductCategory =
  | "SIMULATION"
  | "TRAINING"
  | "EQUIPMENT"
  | "SUPPLIES";

export type Product = {
  id: string;
  category: ProductCategory;
  title: string;
  price: number;
  imageSrc?: string;
  imageAlt?: string;
  detailsHref: string;
};
