"use client";

import { usePathname } from "next/navigation";
import { CartProvider } from "@/app/public/context/cart-context";
import { WishlistProvider } from "@/app/public/context/wishlist-context";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isPublicTicketRoute = pathname?.startsWith("/dashboard/user/ticket/");

  if (isPublicTicketRoute) {
    return <>{children}</>;
  }

  return (
    <CartProvider>
      <WishlistProvider>{children}</WishlistProvider>
    </CartProvider>
  );
}
