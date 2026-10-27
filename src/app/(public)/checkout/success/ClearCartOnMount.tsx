"use client";

import { useEffect } from "react";
import { useCart } from "@/components/cart/CartProvider";

/** Empties the cart once the client lands back from a completed checkout. */
export function ClearCartOnMount() {
  const { clear, ready } = useCart();
  useEffect(() => {
    if (ready) clear();
  }, [ready, clear]);
  return null;
}
