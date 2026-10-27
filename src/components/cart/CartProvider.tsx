"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  PRODUCTS,
  findProduct,
  quote,
  type PaymentChoice,
  type Product,
  type ProductCategory,
  type Quote,
} from "@/lib/catalog";

const STORAGE_KEY = "lb.cart.v1";

type Stored = { skus: string[]; payment: PaymentChoice };

type CartContextValue = {
  /** Resolved catalogue items, at most one per category. */
  items: Product[];
  skus: string[];
  payment: PaymentChoice;
  setPayment: (p: PaymentChoice) => void;
  /** Adds a product, replacing whatever was already in its category. */
  add: (sku: string) => void;
  remove: (sku: string) => void;
  /** Adds, or removes if that exact SKU is already in the cart. */
  toggle: (sku: string) => void;
  clear: () => void;
  has: (sku: string) => boolean;
  inCategory: (category: ProductCategory) => Product | null;
  count: number;
  quote: Quote;
  /** False until the saved cart has been read, so SSR and the first paint agree. */
  ready: boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

function readStored(): Stored {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { skus: [], payment: "full" };
    const parsed = JSON.parse(raw) as Partial<Stored>;
    const skus = Array.isArray(parsed.skus)
      ? parsed.skus.filter((s): s is string => typeof s === "string" && Boolean(findProduct(s)))
      : [];
    const payment: PaymentChoice = parsed.payment === "deposit" ? "deposit" : "full";
    return { skus, payment };
  } catch {
    // Private browsing, blocked storage, corrupt JSON — start empty.
    return { skus: [], payment: "full" };
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [skus, setSkus] = useState<string[]>([]);
  const [payment, setPayment] = useState<PaymentChoice>("full");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = readStored();
    setSkus(stored.skus);
    setPayment(stored.payment);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ skus, payment }));
    } catch {
      // Not being able to remember the cart is not worth breaking the page over.
    }
  }, [skus, payment, ready]);

  // Keep the catalogue order so the cart always reads website → brand → ads → care.
  const items = useMemo(
    () => PRODUCTS.filter((p) => skus.includes(p.sku)),
    [skus]
  );

  const add = useCallback((sku: string) => {
    const product = findProduct(sku);
    if (!product) return;
    setSkus((prev) => {
      const kept = prev.filter((s) => findProduct(s)?.category !== product.category);
      return [...kept, sku];
    });
  }, []);

  const remove = useCallback((sku: string) => {
    setSkus((prev) => prev.filter((s) => s !== sku));
  }, []);

  const toggle = useCallback((sku: string) => {
    setSkus((prev) => {
      if (prev.includes(sku)) return prev.filter((s) => s !== sku);
      const product = findProduct(sku);
      if (!product) return prev;
      const kept = prev.filter((s) => findProduct(s)?.category !== product.category);
      return [...kept, sku];
    });
  }, []);

  const clear = useCallback(() => setSkus([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      skus,
      payment,
      setPayment,
      add,
      remove,
      toggle,
      clear,
      has: (sku: string) => skus.includes(sku),
      inCategory: (category: ProductCategory) =>
        items.find((i) => i.category === category) ?? null,
      count: items.length,
      quote: quote(items, payment),
      ready,
    }),
    [items, skus, payment, add, remove, toggle, clear, ready]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
