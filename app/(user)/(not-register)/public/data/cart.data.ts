import {
  CartItem,
  UpsellItem,
} from "@/app/(user)/(not-register)/public/types/cart.type";
import { IMAGE } from "@/constant/image-config";

export const DUMMY_CART_ITEMS: CartItem[] = [
  {
    id: "c1",
    name: "Video Laryngoscope Handle",
    ref: "VL-200-X",
    price: 145,
    qty: 1,
    imageUrl: IMAGE.hand_gloves,
  },
  {
    id: "c2",
    name: "Video Laryngoscope Handle",
    ref: "VL-200-X",
    price: 145,
    qty: 1,
    imageUrl: IMAGE.hand_gloves,
  },
  {
    id: "c3",
    name: "Video Laryngoscope Handle",
    ref: "VL-200-X",
    price: 145,
    qty: 1,
    imageUrl: IMAGE.hand_gloves,
  },
  {
    id: "c4",
    name: "Video Laryngoscope Handle",
    ref: "VL-200-X",
    price: 145,
    qty: 1,
    imageUrl: IMAGE.hand_gloves,
  },
  {
    id: "c5",
    name: "Video Laryngoscope Handle",
    ref: "VL-200-X",
    price: 145,
    qty: 1,
    imageUrl: IMAGE.hand_gloves,
  },
];

export const DUMMY_UPSELL: UpsellItem = {
  id: "u1",
  name: "Lithium Battery Pack",
  price: 12.99,
  imageUrl: IMAGE.hand_gloves,
};
