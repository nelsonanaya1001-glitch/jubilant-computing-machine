import { CartClient } from "./CartClient";
import { stripeEnabled } from "@/lib/stripe";

export const metadata = {
  title: "Your Cart | Launchboarding",
  description:
    "Review what you're ordering, choose a 50% deposit or pay in full, and check out securely.",
};

export default function CartPage() {
  // Whether cards can actually be taken is a server-side fact, so the page
  // tells the client up front rather than failing at the checkout call.
  return (
    <div className="bg-[#080810] text-white min-h-screen">
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[360px] bg-violet-600/10 rounded-full filter blur-[120px]" />
        <div className="relative max-w-6xl mx-auto px-6 lg:px-8 pt-32 pb-14">
          <div className="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-4">
            Checkout
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[0.95]">
            Your cart.
          </h1>
          <p className="text-white/50 mt-4 max-w-lg leading-relaxed">
            Pay a 50% deposit to get started or settle up in full — either way we kick off as
            soon as the payment clears.
          </p>
        </div>
      </section>

      <CartClient paymentsLive={stripeEnabled()} />
    </div>
  );
}
