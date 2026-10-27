"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "./CartProvider";

/** Header cart link. Shows a count badge once something's in there. */
export function CartButton({ onNavigate }: { onNavigate?: () => void }) {
  const { count, ready } = useCart();

  return (
    <Link
      href="/cart"
      onClick={onNavigate}
      aria-label={count > 0 ? `Cart, ${count} item${count === 1 ? "" : "s"}` : "Cart"}
      className="relative inline-flex items-center justify-center w-9 h-9 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
    >
      <ShoppingCart className="w-[18px] h-[18px]" />
      {ready && count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-violet-500 text-white text-[10px] font-bold flex items-center justify-center">
          {count}
        </span>
      )}
    </Link>
  );
}
