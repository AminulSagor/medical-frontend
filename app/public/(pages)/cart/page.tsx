"use client";

import { Suspense } from "react";
import CartPageContent from "./_components/cart-page-content";

export default function CartPage() {
  return (
    <Suspense fallback={null}>
      <CartPageContent />
    </Suspense>
  );
}
