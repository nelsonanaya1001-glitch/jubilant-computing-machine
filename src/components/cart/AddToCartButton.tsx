"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check, ShoppingCart } from "lucide-react";
import { useCart } from "./CartProvider";
import { CATEGORY_LABELS, findProduct } from "@/lib/catalog";
import { cn } from "@/lib/utils";

/**
 * Adds a catalogue item to the cart. Once it's in, the button turns into a
 * link through to the cart so there's always an obvious way forward.
 */
export function AddToCartButton({
  sku,
  className,
  variant = "solid",
}: {
  sku: string;
  className?: string;
  /** "solid" for the emphasised card in a row, "subtle" for the rest. */
  variant?: "solid" | "subtle";
}) {
  const router = useRouter();
  const { has, add, inCategory, ready } = useCart();
  const product = findProduct(sku);
  if (!product) return null;

  const inCart = ready && has(sku);
  const replacing = ready && !inCart ? inCategory(product.category) : null;

  return (
    <div>
      <Button
        onClick={() => {
          if (inCart) {
            router.push("/cart");
            return;
          }
          add(sku);
          router.push("/cart");
        }}
        className={cn(
          "w-full border-0",
          inCart
            ? "bg-emerald-600 hover:bg-emerald-500 text-white"
            : variant === "solid"
            ? "bg-violet-600 hover:bg-violet-500 text-white"
            : "bg-white/5 hover:bg-white/10 text-white",
          className
        )}
      >
        {inCart ? (
          <>
            <Check className="mr-2 w-4 h-4" /> In your cart
          </>
        ) : (
          <>
            <ShoppingCart className="mr-2 w-4 h-4" /> Add to cart
          </>
        )}
      </Button>
      {replacing && (
        <p className="mt-2 text-[11px] text-white/30 text-center">
          Replaces {replacing.name} as your {CATEGORY_LABELS[product.category].toLowerCase()} pick.
        </p>
      )}
    </div>
  );
}
